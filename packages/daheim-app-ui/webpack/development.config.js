const merge = require('webpack-merge')
const path = require('path')
const webpack = require('webpack')
var fs = require('fs')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin')
var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./universal'))

var port = (+process.env.PORT + 1) || 3001

// const ENV = require('./env')
const ENV = process.env.NODE_ENV
const PATHS = {
  src: path.join(__dirname, '../src'),
  build: path.join(__dirname, '../build')
}

process.env.BABEL_ENV = ENV

var common = {
  context: path.resolve(__dirname, '..'),

  entry: {
    main: [
      './src/index.js'
    ]
  },
  output: {
    path: PATHS.build,
    // TODO: Cannot use [chunkhash] for chunk in '/bundle-[chunkhash].js' (use [hash] instead)
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: 'http://' + process.env.DEV_PUBLIC + ':' + port + '/'
  },
  progress: true,
  devtool: (ENV === 'development' ? 'eval' : 'source-map'),
  module: {
    loaders: [
      { test: /\.json$/, loader: 'json-loader' },
      {
        test: /\.css$/,
        loaders: ['style', 'css?url=false']
        // include: PATHS.src
      },
      {
        test: /\.jsx?$/,
        loader: (ENV === 'development' ? 'react-hot!' : '') + 'babel?cacheDirectory',
        exclude: /node_modules/
        // include: PATHS.src
      },
      { test: /\.less$/, loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!autoprefixer?browsers=last 2 version!less?outputStyle=expanded&sourceMap' },
      { test: /\.scss$/, loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap' }
      // { test: /\.less$/, loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!autoprefixer?browsers=last 2 version!less?outputStyle=expanded&sourceMap') },
      // { test: /\.scss$/, loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap') }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(ENV)
    }),
    new webpack.ProvidePlugin({
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    }),
    new ExtractTextPlugin('[name]-[chunkhash].css', {allChunks: true}),
    webpackIsomorphicToolsPlugin.development()
  ],
  resolve: {
    modulesDirectories: [
      'src',
      'node_modules'
    ],
    extensions: ['', '.json', '.js', '.jsx', '.scss']
  },
  devServer: {
    // contentBase: PATHS.build,
    contentBase: path.join(__dirname, 'www'),

    // Enable history API fallback so HTML5 History API based
    // routing works. This is a good default that will come
    // in handy in more complicated setups.
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true,
    publicPath: 'http://' + process.env.DEV_PUBLIC + ':' + port + '/',

    // Display only errors to reduce the amount of output.
    stats: 'errors-only',
    // stats: {colors: true},

    // Parse host and port from env so this is easy to customize.
    host: '0.0.0.0',
    port
  },
  node: {
    fs: 'empty'
  }
}

if (process.env.USE_HTTPS === '1') {
  common = merge(common, {
    output: {
      publicPath: 'https://' + process.env.DEV_PUBLIC + ':' + port + '/'
    },
    devServer: {
      https: true,
      cert: fs.readFileSync(process.env.SSL_CERT),
      key: fs.readFileSync(process.env.SSL_KEY),
      publicPath: 'https://' + process.env.DEV_PUBLIC + ':' + port + '/'
    }
  })
}

if (ENV === 'development') {
  module.exports = merge(common, {
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  })
} else {
  // config can be added here for minifying / etc
  module.exports = merge(common, {})
}
