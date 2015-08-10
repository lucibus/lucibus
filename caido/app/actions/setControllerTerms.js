function setControllerTerms (args, state) {
  var {terms} = args
  state.set(['local', 'controller', 'terms'], terms)
}

setControllerTerms.input = {
  terms: Array
}

export default setControllerTerms
