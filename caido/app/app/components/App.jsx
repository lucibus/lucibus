/*eslint-disable react/prop-types */
import React, {Component} from 'react'
import {Container} from 'cerebral-react'
import classNames from 'classnames'
import {capitalize} from 'lodash'
import Mousetrap from 'mousetrap'

import {Cerebral} from 'common/utils'

import Live from 'live/components/Live'
import Patch from 'patch/components/Patch'
import Cues from 'cues/components/Cues'

import styles from './App.css'
import './App.less'

const pages = {
  'live': Live,
  'patch': Patch,
  'cues': Cues
}

@Cerebral({
  page: ['local', 'page']
}, {
  page: React.PropTypes.string.isRequired
})
class App extends Component {

  createOnClick (page) {
    return () => {
      this.props.signals.clickedNav({page})
    }
  }

  componentDidMount () {
    Object.keys(pages).map((page, i) => {
      Mousetrap.bind(
        `command+option+${i + 1}`,
        this.createOnClick(page)
      )
    })
  }

  componentWillUnmount () {
    Object.keys(pages).map((_, i) => {
      Mousetrap.unbind(
        `command+option+${i + 1}`
      )
    })
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

export default (config) => {
  window.caidoConfig = config || {}
  var controller = require('controller')

  return <Container controller={controller} app={App}/>
}
