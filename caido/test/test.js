import assert from 'assert'

describe('App', function () {
  it('should exist', function *() {
    yield browser.url('/')
    var content = yield browser.element('#content')
    assert(content)
  })
  describe('Live', function () {
    it('should exist', function *() {
      var live = yield browser.element('#live')
      assert(live)
    })
  })
})
