import React from 'react'
import {assign} from 'lodash'
import {addons} from 'react/addons'

import Component from '../Component'

import styles from './Level.css'
import PercentInput from '../elements/PercentInput'
import {cerebralPropTypes, Cerebral} from '../utils'

@Cerebral(props => ({
  level: props.systemPath.concat(['level'])
}))
class Level extends Component {
  onChange (value) {
    addons.Perf.start()
    this.props.signals.levelChanged(true, {
      systemPath: this.props.systemPath,
      level: value
    })
  }

  render () {
    addons.Perf.stop()
    // addons.Perf.printInclusive()
    // addons.Perf.printExclusive()
    // addons.Perf.printWasted()
    return (
      <div className={styles['level']}>
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
