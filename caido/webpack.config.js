var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var loadersByExtension = require('./config/loadersByExtension')
var booleanFromEnv = require('./config/booleanFromEnv')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var AutoprefixerCore = require('autoprefixer-core')

var plugins = [
  new webpack.PrefetchPlugin('react'),
  new HtmlWebpackPlugin({
    inject: true,
    template: 'app/index.html'
  }),
  new webpack.PrefetchPlugin('react/lib/ReactComponentBrowserEnvironment'),
  new ExtractTextPlugin('[name].css', {
    allChunks: true
  }),
  new webpack.NoErrorsPlugin()
]

if (booleanFromEnv('WEBPACK_MINIMIZE_DEV', false)) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  )
}


module.exports = {
  entry: booleanFromEnv('WEBPACK_HOT_COMPONENTS', false) ? [
    'webpack-dev-server/client?http://0.0.0.0:3000', // WebpackDevServer host and port
    'webpack/hot/dev-server',
    './app/main'
  ] : './app/main',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    sourceMapFilename: '[name].map',
    pathinfo: process.env.WEBPACK_DEBUG
  },
  module: {
    loaders: loadersByExtension({
      'jsx': booleanFromEnv('WEBPACK_HOT_COMPONENTS', false) ? ['react-hot', 'babel-loader?stage=0'] : 'babel-loader?stage=0',
      'js': {
        loader: 'babel-loader?stage=0',
        include: path.join(__dirname, 'app')
      },
      'json': 'json-loader',
      'json5': 'json5-loader',
      'txt': 'raw-loader',
      'png|jpg|jpeg|gif|svg': 'url-loader?limit=10000',
      'woff|woff2': 'url-loader?limit=100000',
      'ttf|eot': 'file-loader',
      'wav|mp3': 'file-loader',
      'html': 'html-loader',
      'md|markdown': ['html-loader', 'markdown-loader'],
      'css': ExtractTextPlugin.extract('style-loader', 'css-loader?module&importLoaders=1!postcss-loader'),
      'less': ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader'),
      'styl': ExtractTextPlugin.extract('style-loader', 'css-loader!stylus-loader')

    }),
    preloaders: loadersByExtension({
      'js': 'source-map-loader'
    })
  },
  postcss: [AutoprefixerCore],
  devtool: process.env.WEBPACK_DEVTOOL,
  debug: booleanFromEnv('WEBPACK_DEBUG', false),
  resolve: {
    root: path.join(__dirname, 'app'),
    extensions: ['', '.web.js', '.js', '.jsx']
  },
  plugins: plugins,
  devServer: {
    port: 8080,
    host: '0.0.0.0',
    inline: true
  }
}
