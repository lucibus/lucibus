import React from 'react'
import classNames from 'classnames'
// import {ReactSlider} from 'react-slider'

import Component from '../Component'

class Level extends Component {
  render () {
    return (
      <p>
        <span className={classNames('label', 'label-' + this.props.status)}>{this.props.description}</span> @ <span className='label label-info'>{this.props.level * 100}%</span>
      </p>
    )
  }
}

Level.propTypes = {
  description: React.PropTypes.string,
  status: React.PropTypes.string,
  level: React.PropTypes.number
}

Level.defaultProps = { status: 'success' }

export default Level
