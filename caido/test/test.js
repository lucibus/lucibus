import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

/*
Tests use a few different parts. First, overall they use
[Mocha](http://mochajs.org/). That does the `it` and `describe` and `before`
blocks. Then we use [Chai](http://chaijs.com/) for assertions. The
`browser` object comes from [WebdriverIO](http://www.webdriver.io/api.html)
*/

const DELETE = '\uE003'
const TAB = '\uE004'
// const RETURN = '\uE006'
const DOWN_ARROW = '\uE015'

function stateEquals (state) {

  return browser.execute(function () {
    function removeUUID (system) {
      delete system.uuid
      if (system.hasOwnProperty('systems')) {
        system.systems.map(removeUUID)
      }
    }
    var state = JSON.parse(window.caidoConfig.lastMessage)
    removeUUID(state.live)
    return state
  })
  .should.eventually.have.property('value')
  .to.deep.equal(state)
}

describe('App', function () {
  chai.use(chaiAsPromised)
  chai.should()
  chaiAsPromised.transferPromiseness = browser.transferPromiseness

  beforeEach('go to URL', function *() {
    yield browser.url('/?mock_websocket=true')

  })

  it('should exist', function *() {
    yield browser.isVisible('#content').should.eventually.be.true
  })
  describe('Live', function () {
    it('should exist', function *() {
      yield browser.isVisible('#live').should.eventually.be.true
    })
    it('should contain text Live', function *() {
      yield browser.getText('#live h2').should.eventually.be.equal('Live')
    })
    describe('Grandmaster', function () {
      it('should exist', function *() {
        yield browser.isVisible('#grandmaster').should.eventually.be.true
      })
      it('should contain text Grandmaster', function *() {
        yield browser.getText('#grandmaster').should.eventually.include('Grandmaster')
      })
      describe('Level', function () {
        it('should exist', function *() {
          yield browser.isVisible('#grandmaster .level').should.eventually.be.true
        })
        it('should have input', function *() {
          yield browser.isVisible('#grandmaster .level input').should.eventually.be.true
        })
        it('should start at 100', function *() {
          yield browser.getValue('#grandmaster .level input').should.eventually.be.equal('100')
        })
        function * click () {
          yield browser.waitForVisible('#grandmaster .level input')
          yield browser.click('#grandmaster .level input')
        }
        function * clickAndType () {
          yield* click()
          yield browser.keys(DELETE + DELETE + DELETE + '50')
          yield browser.getValue('#grandmaster .level input').should.eventually.be.equal('50')
        }
        it('clicking on it and typing should change value', clickAndType)
        it('typing should update state', function *() {
          yield* clickAndType()
          yield stateEquals({live: {level: 0.5, systems: []}})
        })
        it('using arrow keys should update', function *() {
          yield* click()
          yield browser.keys(DOWN_ARROW)
          yield stateEquals({live: {level: 0.99, systems: []}})
        })
      })
    })
    describe('New System', function () {
      it('should exist', function *() {
        yield browser.isVisible('#new-system').should.eventually.be.true
      })
      it('should be able to add', function *() {
        yield browser.waitForVisible('#new-system .query').click('#new-system .query')
        yield browser.keys(`Address 1${TAB}40${TAB}`)
        yield browser.click('#new-system button')
        yield stateEquals({live: {level: 1, systems: [{address: 1, level: 0.4}]}})
      })
    })
  })
})
