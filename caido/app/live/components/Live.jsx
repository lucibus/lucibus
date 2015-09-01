import React, {Component} from 'react'

import LiveList from './LiveList'
import Grandmaster from './Grandmaster'
import LiveCue from 'cues/components/LiveCue.jsx'
import styles from './Live.css'

class Live extends Component {
  render () {
    return (
      <div className='col-lg-12' id='live'>
        <h2>Live</h2>
        <Grandmaster/>
        <div className={styles['under-grandmaster']}>
          <LiveList/>
          <LiveCue/>
        </div>
      </div>
    )
  }
}
export default Live
