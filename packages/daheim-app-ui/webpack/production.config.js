var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin')
var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./universal'))

var common = {
  context: path.resolve(__dirname, '..'),

  entry: {
    main: [
      './src/index.js'
    ]
  },
  output: {
    path: path.join(__dirname, '..', 'build'),
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: '/dist/'
  },
  progress: true,
  devtool: 'source-map',
  module: {
    preLoaders: [
      {test: /package\.json$/, loader: '../webpack/package_json_loader'}
    ],
    loaders: [
      {test: /\.json$/, loader: 'json-loader'},
      {test: /\.jsx?$/, loader: 'babel?cacheDirectory', exclude: /node_modules/},
      {test: /\.less$/, loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!autoprefixer?browsers=last 2 version!less?outputStyle=expanded&sourceMap'},
      {test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=2&sourceMap!autoprefixer?browsers=last 2 version')},
      {test: /\.scss$/, loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=2&sourceMap!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap=true&sourceMapContents=true')}
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /de/),
    new webpack.ProvidePlugin({
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    }),
    new ExtractTextPlugin('[name]-[chunkhash].css', {allChunks: true}),

    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),

    webpackIsomorphicToolsPlugin
  ],
  resolve: {
    modulesDirectories: [
      'src',
      'node_modules'
    ],
    extensions: ['', '.json', '.js', '.jsx', '.scss']
  },
  node: {
    fs: 'empty'
  }
}

module.exports = common
