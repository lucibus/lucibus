import React from 'react'
import classNames from 'classnames'

import Component from '../Component'

import LiveList from './LiveList'
import LiveLevel from './LiveLevel'

import styles from './App.css'
import './App.less'

export default class App extends Component {
  render () {
    return (
      <div className={classNames('container', styles.body)}>
        <div className='row'>
          <div className='col-lg-12'>
            <h1>Live</h1>
            <LiveLevel/>
            <LiveList/>
          </div>
        </div>
      </div>
    )
  }
}
