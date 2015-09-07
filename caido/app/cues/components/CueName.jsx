/*eslint-disable react/prop-types */
import React, {Component} from 'react'

import {Cerebral} from 'common/utils'
import styles from './CueName.css'

export default @Cerebral(props => ({
  cue: props.cuePath
}), {
  cue: React.PropTypes.object.isRequired
})
class CueName extends Component {
  onChange (event) {
    var name = event.target.value
    this.props.signals.changedCueName(true, {cuePath: this.props.cuePath, name})
  }

  render () {
    return (
      <input
        type='text'
        value={this.props.cue.name}
        onChange={this.onChange.bind(this)}
        className={styles['hidden-input']}
        placeholder='Cue name'
      />
    )
  }
}
