var booleanFromEnv = require('./config/booleanFromEnv')
var flattenBrowser = require('zuul/lib/flatten_browser')
var request = require('sync-request')
var assign = require('lodash').assign

// copied from https://github.com/defunctzombie/zuul/blob/18e1a674f54b7d131b5e5ff82b2a6a75a49ec0c4/lib/scout_browser.js#L42-L56
function format (obj) {
  var browsers = {}
  obj.forEach(function (info) {
    var name = info.api_name

    var browser = browsers[name] = browsers[name] || []
    browser.push({
      name: name,
      version: info.short_version,
      platform: info.os
    })
  })

  return browsers
}

function queryBrowsers (query, optionalKeys) {
  var res = request('GET', 'https://saucelabs.com/rest/v1/info/browsers/webdriver')
  var allBrowsers = JSON.parse(res.getBody('utf8'))
  var chosenBrowsers = flattenBrowser(query, format(allBrowsers))
  chosenBrowsers.map(function (browser) {
    assign(browser, optionalKeys)
    browser.browserName = browser.name
    delete browser.name
  })
  return chosenBrowsers
}

require('babel/register')({
  experimental: true,
  blacklist: [
    'regenerator'
  ]
})

var config = {
  //
  // ==================
  // Specify Test Files
  // ==================
  // Define which test specs should run. The pattern is relative to the location of this
  // file.
  //
  specs: [
    './test/**/*.js'
  ],
  // Patterns to exclude.
  exclude: [
    // 'path/to/excluded/files'
  ],
  //
  // ============
  // Capabilities
  // ============
  // Define your capabilities here. WebdriverIO can run multiple capabilties at the same
  // time. Depending on the number of capabilities WebdriverIO launches several test
  // sessions. Within your capabilities you can overwrite the spec and exclude option in
  // order to group specific specs to a specific capability.
  //
  // If you have trouble getting all important capabilities together check out Sauce Labs
  // platform configurator. A great tool to configure your capabilities.
  // https://docs.saucelabs.com/reference/platforms-configurator
  //
  capabilities: [{
    browserName: 'chrome',
    platform: 'MAC',
    chromeOptions: {
      binary: require('expand-home-dir')('~') + '/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary'
    }
  }
  // {
  //   browserName: 'phantomjs'
  // }
  ],
  //
  // ===================
  // Test Configurations
  // ===================
  // Define all options that are relevant for the WebdriverIO instance here
  //
  // Level of logging verbosity.
  logLevel: 'silent',
  //
  // Enables colors for log output
  coloredLogs: true,
  //
  // Saves a screenshot to a given path if a command fails.
  screenshotPath: './errorShots/',

  //
  // Default timeout for all waitForXXX commands.
  waitforTimeout: 1000,
  //
  // Initialise the browser instance with a WebdriverIO plugin. The object should have the
  // plugin name as key and the desired plugin options as property. Make sure you have
  // the plugin installed before running any tests. The following plugins are currently
  // available:
  // WebdriverCSS: https://github.com/webdriverio/webdrivercss
  // WebdriverRTC: https://github.com/webdriverio/webdriverrtc
  // Browserevent: https://github.com/webdriverio/browserevent
  // plugins: {
  //     webdrivercss: {
  //         screenshotRoot: 'my-shots',
  //         failedComparisonsRoot: 'diffs',
  //         misMatchTolerance: 0.05,
  //         screenWidth: [320,480,640,1024]
  //     },
  //     webdriverrtc: {},
  //     browserevent: {}
  // },
  //
  // Framework you want to run your specs with.
  // The following are supported: mocha, jasmine and cucumber
  // see also: http://webdriver.io/guide/testrunner/frameworks.html
  //
  // Make sure you have the node package for the specific framework installed before running
  // any tests. If not please install the following package:
  // Mocha: `$ npm install mocha`
  // Jasmine: `$ npm install jasmine`
  // Cucumber: `$ npm install cucumber`
  framework: 'mocha',
  //
  // Test reporter for stdout.
  // The following are supported: dot (default), spec and xunit
  // see also: http://webdriver.io/guide/testrunner/reporters.html
  reporter: 'spec',

  //
  // Options to be passed to Mocha.
  // See the full list at http://mochajs.org/
  mochaOpts: {
    ui: 'bdd'
    // 'check-leaks': true,
    // bail: true
  },

  // Shorten url command calls by setting a base url. If your url parameter starts with '/'
  // the base url gets prepended.
  baseUrl: 'http://localhost:5050'
}

if (booleanFromEnv('WDIO_SAUCELABS', false)) {
  //
  // =================
  // Service Providers
  // =================
  // WebdriverIO supports Sauce Labs, Browserstack and Testing Bot (other cloud providers
  // should work too though). These services define specific user and key (or access key)
  // values you need to put in here in order to connect to these services.
  //
  config.user = process.env.SAUCE_USERNAME
  config.key = process.env.SAUCE_ACCESS_KEY

  //
  // If you are using Sauce Labs WebdriverIO takes care about updating the job information
  // once the test is done. This option is set to `true` per default.
  //
  config.updateSauceJob = true
  // delete config.reporter
  config.runsWithSauce = true

  config.capabilities = queryBrowsers([
    {name: 'internet explorer', version: '10..latest'},
    {name: 'firefox', version: '38..latest'},
    {name: 'chrome', version: '43..latest'},
    {name: 'safari', version: '8..latest'},
    {name: 'iphone', version: '8.4..latest'}
  ], {
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'idle-timeout': 900,
    name: 'lucibus/caido',
    build: process.env.TRAVIS_BUILD_NUMBER
  })
}

exports.config = config
