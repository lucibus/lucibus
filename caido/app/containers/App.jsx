import React, {Component} from 'react'
import {Container} from 'cerebral-react'
import classNames from 'classnames'
import {assign, capitalize} from 'lodash'

import {cerebralPropTypes, Cerebral} from '../utils'

import Live from './Live'
import Patch from './Patch'

import styles from './App.css'
import './App.less'

const pages = {
  'live': Live,
  'patch': Patch
}

@Cerebral({
  page: ['local', 'page']
})
class App extends Component {

  createOnClick (page) {
    return () => {this.props.signals.clickedNav({page})}
  }

  render () {
    var Page = pages[this.props.page]
    return (
      <div>
        <nav className='navbar navbar-default navbar-static-top'>
          <div className='container'>
            <div className='navbar-header'>
              <span className='navbar-brand'>Lucibus</span>
            </div>
            <ul className='nav navbar-nav'>
              {
                Object.keys(pages).map(p => {
                  return (
                    <li key={p} className={classNames({active: p === this.props.page}, styles.clickable)} onClick={this.createOnClick(p)}>
                      <a>{capitalize(p)}</a>
                    </li>
                  )
                })
              }
            </ul>
          </div>
        </nav>
        <div className={classNames('container', styles.body)}>
          <div className='row'>
            <Page />
          </div>
        </div>
      </div>
    )
  }
}

App.propTypes = assign(
  {},
  {
    page: React.PropTypes.string.isRequired
  },
  cerebralPropTypes
)

export default (config) => {
  window.caidoConfig = config || {}
  var controller = require('../controller')

  return <Container controller={controller} app={App}/>
}
