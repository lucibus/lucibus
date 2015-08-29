import React, {Component} from 'react'

import LiveList from './LiveList'
import Grandmaster from './Grandmaster'

class Live extends Component {
  render () {
    return (
      <div className='col-lg-12' id='live'>
        <h2>Live</h2>
        <Grandmaster/>
        <LiveList/>
      </div>
    )
  }
}
export default Live
