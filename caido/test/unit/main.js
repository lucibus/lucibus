import controller from 'controller'
import 'must'

function setSyncedAction ({synced}, state) {
  state.set('synced', synced)
}

describe('controller', function () {
  before(function () {
    controller.signal('testSetSynced', setSyncedAction)
  })
  it('must accept a valid state', function () {
    var synced = {live: {systems: [], level: 0.7}}
    controller.signals.testSetSynced(true, {synced})
    controller.get('synced').must.eql(synced)
  })
  it('must not accept an invalid system', function () {
    var synced = {}
    controller.signals.testSetSynced(true, {synced})
    controller.get('synced').must.not.eql(synced)
  })
})
