import React from 'react'

import Component from '../Component'

import LiveList from './LiveList'
import Grandmaster from './Grandmaster'

class Live extends Component {
  render () {
    return (
      <div className='col-lg-3' id='live'>
        <h2>Live</h2>
        <Grandmaster/>
        <LiveList/>
      </div>
    )
  }
}
export default Live
