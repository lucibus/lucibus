import React from 'react'
import {round} from 'lodash'

import Component from '../Component'
import styles from './PercentInput.css'

function clamp (number, min, max) {
  if (number < min) {
    return min
  }
  if (number > max) {
    return max
  }
  return number
}

class PercentInput extends Component {

  onChange (event) {
    var value = event.target.value
    value = clamp(value, 0, 100)
    this.props.onChange(value / 100)
  }

  render () {
    return (
      <input
        className={styles['hidden-input']}
        type='number'
        value={round(this.props.float * 100, 0)}
        onChange={this.onChange.bind(this)}
        max='100'
        min='0'
      />
    )
  }
}

PercentInput.propTypes = {
  float: React.PropTypes.number.isRequired,
  onChange: React.PropTypes.func.isRequired
}

export default PercentInput
