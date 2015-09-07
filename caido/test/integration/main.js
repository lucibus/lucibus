import 'must'
import grandmaster50 from '../../../api/valid/grandmaster-50.state.json'
import grandmaster99 from '../../../api/valid/grandmaster-99.state.json'
import address1 from '../../../api/valid/address-one.state.json'
import address2 from '../../../api/valid/address-two.state.json'
import address2Reversed from '../../../api/valid/address-two-reversed.state.json'

const DELETE = '\uE003'
const TAB = '\uE004'
// const RETURN = '\uE006'
const DOWN_ARROW = '\uE015'

function removeUUID (system) {
  delete system.uuid
  if (system.hasOwnProperty('systems')) {
    system.systems.map(removeUUID)
  }
}

function cleanState (state) {
  removeUUID(state.live)
  return state
}

function stateEquals (state) {
  return browser.pause(50).execute(function () {
    return window.caidoConfig.lastMessage
  }).then(response => {
    var {value} = response
    var state = JSON.parse(value)
    return cleanState(state)
  })
  .must.eventually.eql(cleanState(state))
}

describe('App', function () {
  beforeEach('go to URL', function *() {
    yield browser.url('/?mock_websocket=true')
  })

  it('must exist', function *() {
    yield browser.isVisible('#content').must.eventually.equal(true)
  })
  describe('Live', function () {
    it('must exist', function *() {
      yield browser.isVisible('#live').must.eventually.equal(true)
    })
    it('must contain text Live', function *() {
      yield browser.getText('#live h2').must.eventually.equal('Live')
    })
    describe('Grandmaster', function () {
      it('must exist', function *() {
        yield browser.isVisible('#grandmaster').must.eventually.equal(true)
      })
      it('must contain text Grandmaster', function *() {
        yield browser.getText('#grandmaster').must.eventually.include('Grandmaster')
      })
      describe('Level', function () {
        it('must exist', function *() {
          yield browser.isVisible('#grandmaster .level').must.eventually.equal(true)
        })
        it('must have input', function *() {
          yield browser.isVisible('#grandmaster .level input').must.eventually.equal(true)
        })
        it('must start at 100', function *() {
          yield browser.getValue('#grandmaster .level input').must.eventually.equal('100')
        })
        function * click () {
          yield browser.waitForVisible('#grandmaster .level input')
          yield browser.click('#grandmaster .level input')
        }
        function * clickAndType () {
          yield* click()
          yield browser.keys(DELETE + DELETE + DELETE + '50')
          yield browser.getValue('#grandmaster .level input').must.eventually.equal('50')
        }
        it('clicking on it and typing must change value', clickAndType)
        it('typing must update state', function *() {
          yield* clickAndType()
          yield (grandmaster50)
        })
        it('using arrow keys must update', function *() {
          yield* click()
          yield browser.keys(DOWN_ARROW)
          yield stateEquals(grandmaster99)
        })
      })
    })

    function * addSystem (address, level) {
      yield browser.waitForVisible('#new-system .query').click('#new-system .query')
      yield browser.keys(`Address ${address}${TAB}${TAB}${level}${TAB}`)
      yield browser.click('#new-system button')
    }
    describe('New System', function () {
      it('must exist', function *() {
        yield browser.isVisible('#new-system').must.eventually.equal(true)
      })
      it('must be able to add', function *() {
        yield* addSystem('1', '100')
        yield stateEquals(address1)
      })
    })
    describe.skip('Systems', function () {
      beforeEach('add two systems', function *() {
        yield* addSystem('1', '100')
        yield* addSystem('2', '100')
        yield stateEquals(address2)
      })
      it('must exist', function *() {
        yield browser.isVisible('.system-li .drag-handle:nth-Child(1)').must.eventually.equal(true)
      })
      it('must be able to drag', function *() {
        yield browser.dragAndDrop('.system-li .drag-handle:nth-Child(1)', '.system-li .drag-handle:nth-Child(2)')
        yield stateEquals(address2Reversed)
      })
    })
  })
})
