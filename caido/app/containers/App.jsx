import React from 'react'
import classNames from 'classnames'

import Component from '../Component'

import Live from './Live'

import styles from './App.css'
import './App.less'

class App extends Component {
  render () {
    return (
      <div className={classNames('container', styles.body)}>
        <div className='row'>
          <Live />
        </div>
      </div>
    )
  }
}

export default (config) => {
  window.caidoConfig = config || {}
  return require('../controller').injectInto(App)
}
