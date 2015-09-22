import 'must'

describe('App', function () {
  before('init', function *() {
    yield browser.init()
  })
  after('end', function *() {
    yield browser.end()
  })
  before('go to URL', function *() {
    yield browser.url('/')
  })

  describe('Grandmaster level', function () {
    function * mustEqual (b, value) {
      yield b.getValue('#grandmaster .level input').must.eventually.equal(value.toString())
    }
    it('must start at 100', function *() {
      yield* mustEqual(firstBrowser, 100)
      yield* mustEqual(secondBrowser, 100)
      yield browser.sync()
    })
    function * clickAndType (b, value) {
      yield b.waitForVisible('#grandmaster .level input')
      yield b.setValue('#grandmaster .level input', value.toString())
    }
    it('changing on one should change both', function *() {
      yield* clickAndType(firstBrowser, 10)
      yield* mustEqual(firstBrowser, 10)
      yield browser.pause(2000)
      yield* mustEqual(secondBrowser, 10)

      yield browser.sync()

      yield* clickAndType(secondBrowser, 20)
      yield* mustEqual(secondBrowser, 20)
      yield browser.pause(2000)
      yield* mustEqual(firstBrowser, 20)
    })
  })
})
