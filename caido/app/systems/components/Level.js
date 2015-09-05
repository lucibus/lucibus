/*eslint-disable react/prop-types */
import React, {Component} from 'react'

import {Cerebral, pathPropType} from 'common/utils'
import PercentInput from 'common/components/PercentInput'
import styles from './Level.css'

@Cerebral(props => ({
  level: props.systemPath.concat(['level'])
}), {
  level: React.PropTypes.number
})
class Level extends Component {
  onChange (value) {
    this.props.signals.levelChanged(true, {
      systemPath: this.props.systemPath,
      level: value
    })
  }

  render () {
    return (
      <div className={styles['level'] + ' level'}>
        @&nbsp;
        <span className='label label-info'>
          <PercentInput float={this.props.level} onChange={this.onChange.bind(this)} type='number'/>
        </span>
      </div>
    )
  }
}

Level.propTypes = {
  systemPath: pathPropType
}

export default Level
