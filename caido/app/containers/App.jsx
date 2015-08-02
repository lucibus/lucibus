import React from 'react'

import Component from '../Component'

import LiveList from './LiveList'
import LiveLevel from './LiveLevel'

import './App.css'
import './App.less'

export default class App extends Component {
  render () {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='panel panel-primary'>
              <div className='panel-heading'>Live</div>
              <div className='panel-body'>
                <div className='col-lg-10'>
                  <LiveLevel/>
                  <LiveList/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
