import React, {Component} from 'react'

import LiveList from './LiveList'
import Grandmaster from './Grandmaster'

class Live extends Component {
  render () {
    return (
      <div className='col-lg-6' id='live'>
        <h2>Live</h2>
        <Grandmaster/>
        <LiveList/>
      </div>
    )
  }
}
export default Live
