import Controller from 'cerebral'
import Model from 'cerebral-baobab'
import signals from './signals'
import schema from './schema'
import state from './state'

const baobabOptions = {
  asynchronous: false,
  validate: (previousState, newState, affectedPaths) => {
    var valid = schema(newState.synced)
    if (!valid) {
      console.error('Invalid schema', {newState, affectedPaths, errors: schema.errors})
      return new Error(schema.errors)
    }
    return true
  }
}

const model = Model(state, baobabOptions)
const services = {}
var controller = Controller(model, services)
signals(controller)
export default controller
