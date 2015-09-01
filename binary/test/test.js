import 'must'
import webdriverio from 'webdriverio'

function booleanFromEnv (key, defaultValue) {
  return JSON.parse(process.env[key] || defaultValue)
}
var config

if (booleanFromEnv('CI', false)) {
  config = {
    waitforTimeout: 10000,
    user: process.env.BROWSERSTACK_USERNAME,
    key: process.env.BROWSERSTACK_ACCESS_KEY,
    baseUrl: 'http://localhost:8081',
    desiredCapabilities: {
      browserName: 'chrome',
      project: 'lucibus',
      version: '44.0',
      build: 'lucibus #' + process.env.TRAVIS_BUILD_NUMBER + process.env.TRAVIS_JOB_NUMBER,
      'browserstack.local': 'true',
      'browserstack.debug': 'true'
    }
  }
} else {
  config = {
    baseUrl: 'http://localhost:8081',
    desiredCapabilities: {
      browserName: 'chrome'
    }
  }
}

var browsers = webdriverio.multiremote({
  first: config,
  second: config
})

var firstBrowser = browsers.select('first')
var secondBrowser = browsers.select('second')

describe('App', function () {
  before('init', function *() {
    yield browsers.init()
  })
  after('end', function *() {
    yield browsers.end()
  })
  before('go to URL', function *() {
    yield browsers.url('/')
  })

  describe('Grandmaster level', function () {
    function * mustEqual (b, value) {
      yield b.getValue('#grandmaster .level input').must.eventually.equal(value.toString())
    }
    it('must start at 100', function *() {
      yield* mustEqual(firstBrowser, 100)
      yield* mustEqual(secondBrowser, 100)
      yield browsers.sync()
    })
    function * clickAndType (b, value) {
      yield b.waitForVisible('#grandmaster .level input')
      yield b.setValue('#grandmaster .level input', value.toString())
    }
    it('changing on one should change both', function *() {
      yield* clickAndType(firstBrowser, 10)
      yield* mustEqual(firstBrowser, 10)
      yield browsers.pause(2000)
      yield* mustEqual(secondBrowser, 10)

      yield browsers.sync()

      yield* clickAndType(secondBrowser, 20)
      yield* mustEqual(secondBrowser, 20)
      yield browsers.pause(2000)
      yield* mustEqual(firstBrowser, 20)
    })
  })
})
