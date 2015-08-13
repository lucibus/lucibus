import React from 'react'

import Component from '../Component'
import System from '../components/System'

class Grandmaster extends Component {
  render () {
    return (
      <System systemPath={['synced', 'live']}/>
    )
  }
}

Grandmaster.propTypes = {}

export default Grandmaster
