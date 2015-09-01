import React, {Component} from 'react'
import {assign} from 'lodash'

import {cerebralPropTypes, Cerebral} from 'common/utils'
import PercentInput from 'common/components/PercentInput'
import styles from './Level.css'

@Cerebral(props => ({
  level: props.systemPath.concat(['level']),
  system: props.systemPath
}))
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
          <PercentInput float={this.props.level} onChange={this.onChange.bind(this)}/>
        </span>
      </div>
    )
  }
}

Level.propTypes = assign({}, cerebralPropTypes, {level: React.PropTypes.number})

export default Level
