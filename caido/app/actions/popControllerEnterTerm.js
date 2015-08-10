import {reject} from 'lodash'

function popControllerEnterTerm (args, state, outputs) {
  var {terms} = args

  var oldLength = terms.length
  terms = reject(terms, {'enter': true})

  var didRemoveEnterTerm = terms.length !== oldLength

  if (didRemoveEnterTerm) {
    outputs.found({terms: []})
  } else {
    outputs.notFound({terms})
  }
}

popControllerEnterTerm.input = {
  terms: Array
}

popControllerEnterTerm.outputs = {
  found: {
    terms: Array
  },
  notFound: {
    terms: Array
  }
}

export default popControllerEnterTerm
