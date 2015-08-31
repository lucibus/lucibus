import React, {Component} from 'react'
import {cerebralPropTypes, Cerebral} from '../utils'
import {assign} from 'lodash'

import styles from './CueName.css'

@Cerebral(props => ({
  cue: props.cuePath
}))
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

CueName.propTypes = assign(
  {},
  {
    cuePath: React.PropTypes.array.isRequired,
    cue: React.PropTypes.object.isRequired
  },
  cerebralPropTypes
)

export default CueName
