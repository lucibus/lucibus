function setPage ({page}, state) {
  state.set(['local', 'page'], page)
}

setPage.input = {
  page: String
}

export default setPage
