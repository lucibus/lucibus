var booleanFromEnv = require('./config/booleanFromEnv')

const SAUCELABS = booleanFromEnv('KARMA_SAUCELABS', false)

process.env.WEBPACK_MINIMIZE = 'false'
process.env.WEBPACK_DEVTOOL = 'inline-source-map'
process.env.WEBPACK_INLINE = 'true'

var webpackConf = require('./webpack.config.js')
webpackConf.node = {fs: 'empty'}
webpackConf.module.postLoaders = [{
  test: /\.js(x)?$/,
  include: /app\//,
  loader: 'istanbul-instrumenter'
}]

const customLaunchers = {
  sl_chrome: {
    base: 'SauceLabs',
    browserName: 'chrome',
    platform: 'Windows 7',
    version: '35'
  },
  sl_firefox: {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: '30'
  },
  sl_ios_safari: {
    base: 'SauceLabs',
    browserName: 'iphone',
    platform: 'OS X 10.9',
    version: '7.1'
  },
  sl_ie_11: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 8.1',
    version: '11'
  }
}

module.exports = function (config) {
  config.set({
    browsers: SAUCELABS ? Object.keys(customLaunchers) : ['ChromeCanary'],
    frameworks: [ 'tap' ],
    files: [
      // all files ending in "_test"
      'test/*_test.js',
      'test/**/*_test.js'
      // each file acts as entry point for the webpack configuration
    ],
    customLaunchers: SAUCELABS ? customLaunchers : {},
    preprocessors: {
      // add webpack as preprocessor
      'test/*_test.js': ['webpack', 'inject-html'],
      'test/**/*_test.js': ['webpack', 'inject-html']
    },
    injectHtml: {
      file: 'test/index.html'
    },
    reporters: [
      'dots',
      'coverage'
    ].concat(SAUCELABS ? ['saucelabs'] : []),
    webpack: webpackConf,
    webpackServer: {
      noInfo: true
    },
    coverageReporter: {
      type: 'text',
      dir: 'coverage/'
    },
    plugins: [
      require('karma-webpack'),
      require('karma-tap'),
      require('karma-chrome-launcher'),
      require('karma-inject-html'),
      require('karma-coverage')
    ]
  })
}
