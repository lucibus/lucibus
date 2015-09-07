import {stringify} from './utils'

export function updateNow (input, state) {
  state.set(['local', 'now'], stringify())
}
