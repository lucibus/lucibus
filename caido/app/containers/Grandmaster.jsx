import React from 'react'
import {Decorator} from 'cerebral-react-baobab'

import Component from '../Component'
import System from './System'

@Decorator({
  level: [
    'synced',
    'live',
    'level'
  ]
})
class Grandmaster extends Component {
  render () {
    return (
      <System description='Grandmaster' level={this.props.level} status='primary' uuid='live'/>
    )
  }
}

Grandmaster.propTypes = {
  level: React.PropTypes.number
}

export default Grandmaster
