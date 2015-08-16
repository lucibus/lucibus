import React from 'react'
import tape from 'tape'

import App from 'containers/App'

React.render(
  App,
  document.getElementById('content')
)

tape('Exports window', function (t) {
  t.equal(global, window)
  t.end()
})
