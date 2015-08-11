import React from 'react'
import classNames from 'classnames'

import Component from '../Component'

import LiveList from './LiveList'
import Grandmaster from './Grandmaster'
import Inspector from './Inspector'
import Command from './Command'

import styles from './App.css'
import './App.less'

export default class App extends Component {
  render () {
    return (
      <div className={classNames('container', styles.body)}>
        <div className='row'>
          <div className='col-lg-3'>
            <h2>Live</h2>
            <Grandmaster/>
            <LiveList/>

          </div>
          <div className='col-lg-2'>
            <h2>Inspector</h2>
            <Inspector/>
          </div>
        </div>
      </div>
    )
  }
}
