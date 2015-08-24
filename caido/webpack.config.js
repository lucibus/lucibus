var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var loadersByExtension = require('./config/loadersByExtension')
var booleanFromEnv = require('./config/booleanFromEnv')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var AutoprefixerCore = require('autoprefixer-core')
require('babel-core/polyfill')

const INLINE = booleanFromEnv('WEBPACK_INLINE', false)
const MINIMIZE = booleanFromEnv('WEBPACK_MINIMIZE', false)

var jsLoaders = [
  'babel-loader' +
    '?stage=0' +
    '&optional[]=runtime' +
    ',optional[]=validation.react' +
//    ',optional[]=validation.undeclaredVariableCheck' +
    ',optional[]=spec.undefinedToVoid' +
    ',optional[]=utility.inlineEnvironmentVariables' +
    ',optional[]=es6.spec.templateLiterals' +
//    ',optional[]=minification.deadCodeElimination' +
//    ',optional[]=minification.constantFolding' +
    ',optional[]=minification.memberExpressionLiterals' +
    ',optional[]=minification.propertyLiterals'
]

jsLoaders = booleanFromEnv('WEBPACK_HOT_COMPONENTS', false) ? ['react-hot'].concat(jsLoaders) : jsLoaders

function styleLoader (otherLoaders) {
  if (INLINE) {
    return 'style-loader!' + otherLoaders
  }
  return ExtractTextPlugin.extract('style-loader', otherLoaders)
}

var config = {
  entry: booleanFromEnv('WEBPACK_HOT_COMPONENTS', false) ? [
    'webpack-dev-server/client?http://0.0.0.0:8080', // WebpackDevServer host and port
    'webpack/hot/dev-server',
    './app/main'
  ] : './app/main',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    sourceMapFilename: '[name].map',
    pathinfo: booleanFromEnv('WEBPACK_DEBUG', false)
  },
  module: {
    loaders: loadersByExtension({
      'jsx': jsLoaders,
      'js': {
        loaders: jsLoaders,
        include: [path.join(__dirname, 'app'), path.join(__dirname, 'test/unit')]
      },
      'json': 'json-loader',
      'json5': 'json5-loader',
      'txt': 'raw-loader',
      'png|jpg|jpeg|gif|svg': INLINE ? 'url-loader' : 'url-loader?limit=1000',
      'woff|woff2': INLINE ? 'url-loader' : 'url-loader?limit=1000',
      'ttf|eot': INLINE ? 'url-loader' : 'file-loader',
      'wav|mp3': INLINE ? 'url-loader' : 'file-loader',
      'html': 'html-loader',
      'md|markdown': ['html-loader', 'markdown-loader'],
      'css': styleLoader('css-loader?module&importLoaders=1!postcss-loader'),
      'less': styleLoader('css-loader!less-loader'),
      'styl': styleLoader('css-loader!stylus-loader')
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
    extensions: ['', '.web.js', '.js', '.jsx'],
    alias: {
//      'react': __dirname + '/node_modules/react',
//      'lodash': __dirname + '/node_modules/lodash'
    }
  },
  plugins: [
    new webpack.PrefetchPlugin('react'),
    new HtmlWebpackPlugin({
      inject: true,
      template: 'app/index.html'
    }),
    new webpack.PrefetchPlugin('react'),
    new webpack.PrefetchPlugin('react-dragula'),
    new webpack.PrefetchPlugin('babel-runtime/helpers/inherits.js'),
    new webpack.PrefetchPlugin('babel-runtime/helpers/get.js'),
    new webpack.PrefetchPlugin('belle'),
    new webpack.PrefetchPlugin('./app/containers/App.less'),
    new webpack.PrefetchPlugin('cerebral-react-baobab/node_modules/cerebral'),
    new webpack.NoErrorsPlugin()
  ],
  devServer: {
    port: 8080,
    host: '0.0.0.0',
    inline: true
  }
}

if (MINIMIZE) {
  config.plugins.push(
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

if (!INLINE) {
  config.plugins.push(
    new ExtractTextPlugin('[name].css', {
      allChunks: true
    })
  )
}

module.exports = config
