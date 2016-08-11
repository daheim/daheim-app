var azureCommon = require('azure-common')
var azureStorage = require('azure-storage')
var zlib = require('zlib')
var Promise = require('bluebird')

function Azure (opt) {
  opt = opt || {}
  if (!opt.storageConnectionString) { throw new Error('opt.storageConnectionString must be defined') }

  var retryOperations = new azureCommon.ExponentialRetryPolicyFilter()

  var ent = azureStorage.TableUtilities.entityGenerator
  var tables = azureStorage.createTableService(opt.storageConnectionString)
    .withFilter(retryOperations)
  var blobs = azureStorage.createBlobService(opt.storageConnectionString)
    .withFilter(retryOperations)

  Azure.extendBlobsWithGzip(blobs)
  Azure.extendBlobsWithLazyContainers(blobs)

  Promise.promisifyAll(blobs)
  Promise.promisifyAll(tables)
  Promise.promisifyAll(zlib)

  this.ent = ent
  this.tables = tables
  this.blobs = blobs
}

Azure.TableQuery = azureStorage.TableQuery
Azure.TableBatch = azureStorage.TableBatch
Azure.prototype.TableQuery = azureStorage.TableQuery
Azure.prototype.TableBatch = azureStorage.TableBatch

Azure.createFromEnv = function () {
  return new Azure({
    storageConnectionString: process.env.AZURE_STORAGE_CONNECTION_STRING
  })
}

Azure.extendBlobsWithGzip = function (blobs) {
  blobs.getBlobToBufferGzipAsync = function (container, path, options) {
    var gunzip = zlib.createGunzip()
    var promise = futureStream(gunzip)

    var az = this.getBlobToStreamAsync(container, path, gunzip, options)
    return Promise.all([promise, az]).spread(function (res, blobsResult) {
      return [res, blobsResult[1]]
    })
  }

  blobs.createBlockBlobFromTextGzipAsync = function (container, path, text, options) {
    if (!Buffer.isBuffer(text)) { text = new Buffer(text) }
    return zlib.gzipAsync(text).then(function (gzipped) {
      return blobs.createBlockBlobFromTextAsync(container, path, gzipped, options)
    })
  }

  function futureStream (stream) {
    var bufs = []
    var resolver = Promise.pending()
    stream.on('data', function (d) {
      bufs.push(d)
    })
    stream.on('end', function () {
      var buf = Buffer.concat(bufs)
      resolver.resolve(buf)
    })
    stream.on('error', function (err) {
      resolver.reject(err)
    })
    return resolver.promise
  }
}

/**
 * Extends blobs with a function lazyContainer(container, cb). It invokes the callback that
 * should run an operation on the container. If cb throws an error with code ContainerNotFound,
 * it creates the container and re-invokes cb.
 */
Azure.extendBlobsWithLazyContainers = function (blobs) {
  blobs.lazyContainer = function (container, cb) {
    return Promise.bind(this).then(function () {
      return cb()
    }).catch(function (err) {
      if (err.code !== 'ContainerNotFound') { throw err }
      return this.createContainerIfNotExistsAsync(container).then(function () {
        return cb()
      })
    })
  }
}

module.exports = Azure
