import React, {Component} from 'react'

import System from '../components/System'

class Grandmaster extends Component {
  render () {
    return (
      <div id='grandmaster'>
        <System systemPath={['synced', 'live']}/>
      </div>
    )
  }
}

Grandmaster.propTypes = {}

export default Grandmaster
