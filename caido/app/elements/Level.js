import React from 'react'
import {round} from 'lodash'

import Component from '../Component'

class Level extends Component {
  render () {
    return (
      <span>@ <span className='label label-info'>{round(this.props.level * 100, 0)}%</span></span>
    )
  }
}

Level.propTypes = {
  level: React.PropTypes.number
}

export default Level
