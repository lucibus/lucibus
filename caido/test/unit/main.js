import controller from 'controller'
import 'must'
import invalid from '../../../api/invalid/empty.state.json'
import valid from '../../../api/valid/sample.state.json'

function setSyncedAction ({synced}, state) {
  state.set('synced', synced)
}

describe('controller', function () {
  before(function () {
    controller.signal('testSetSynced', setSyncedAction)
  })
  it('must accept a valid state', function () {
    controller.signals.testSetSynced(true, {synced: valid})
    controller.get('synced').must.eql(valid)
  })
  it('must not accept an invalid system', function () {
    controller.signals.testSetSynced(true, {synced: invalid})
    controller.get('synced').must.not.eql(invalid)
  })
})
