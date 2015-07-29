import React from 'react'
import {root} from 'baobab-react/decorators'

import './bootswatch.less'

import tree from './tree'
import './debug_'
import Storage from './Storage'
import LiveList from './components/LiveList'
import LiveLevel from './components/LiveLevel'

import './mainApp.css'

tree.on('update', function (e) {
  var newData = e.data.data
  Storage.store(newData)
})

Storage.onMessage(function (data) {
  tree.set(data)
})

@root(tree)
class Application extends React.Component {
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

React.render(
  <Application />,
  document.getElementById('content')
)
