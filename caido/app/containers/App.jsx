import React, {Component} from 'react'
import {Container} from 'cerebral-react'
import classNames from 'classnames'

import Live from './Live'
import Patch from './Patch'

import styles from './App.css'
import './App.less'

class App extends Component {
  render () {
    return (
      <div className={classNames('container', styles.body)}>
        <div className='row'>
          <Live />
          <Patch />
        </div>
      </div>
    )
  }
}

export default (config) => {
  window.caidoConfig = config || {}
  var controller = require('../controller')

  return <Container controller={controller} app={App}/>
}
