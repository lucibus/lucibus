import React from 'react'
import {Decorator} from 'cerebral-react-baobab'

import Component from '../Component'
import Level from '../elements/Level'

export default @Decorator({
  level: [
    'synced',
    'live',
    'level'
  ]
})
class LiveLevel extends Component {
  render () {
    return (
      <Level description='Grandmaster' level={this.props.level} status='primary'/>
    )
  }
}

LiveLevel.propTypes = {
  level: React.PropTypes.number
}

