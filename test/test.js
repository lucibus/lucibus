import 'must'
import webdriverio from 'webdriverio'
import booleanFromEnv from '../caido/config/booleanFromEnv'

var config

if (booleanFromEnv('CI', false)) {
  config = {
    desiredCapabilities: {
      browserName: 'firefox'
    }
  }
} else {
  config = {
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
    yield browsers.url('http://localhost:8081/')
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
      yield firstBrowser.log('browser').then(console.log)
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
