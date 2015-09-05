/*eslint-disable react/prop-types */
import React, {Component} from 'react'

import {Cerebral} from 'common/utils'
import styles from './CueDuration.css'

export default @Cerebral(props => ({
  duration: props.cuePath.concat(['duration'])
}), {
  duration: React.PropTypes.number.isRequired
})
class CueDuration extends Component {
  onChange (event) {
    var duration = parseInt(event.target.value, 10)
    this.props.signals.changedCueDuration(true, {cuePath: this.props.cuePath, duration})
  }

  render () {
    return (
      <input
        type='number'
        min='0'
        value={this.props.duration}
        onChange={this.onChange.bind(this)}
        className={styles['hidden-input']}
      />
    )
  }
}
