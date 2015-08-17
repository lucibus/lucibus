import React from 'react'
import {assign} from 'lodash'

import Component from '../Component'

import styles from './Level.css'
import PercentInput from '../elements/PercentInput'
import {cerebralPropTypes, Cerebral} from '../utils'

@Cerebral(props => ({
  level: props.systemPath.concat(['level'])
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
