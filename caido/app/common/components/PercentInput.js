import React, {Component} from 'react'
// import {round} from 'lodash'

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
    var {float, onChange, ...other} = this.props
    return (
      <input
        className={styles['hidden-input']}
        type={this.props.type}
        disabled={this.props.disabled}
        value={float ? float * 100 : float}
        onChange={this.onChange.bind(this)}
        max='100'
        min='0'
        {...other}
      />
    )
  }
}

PercentInput.propTypes = {
  float: React.PropTypes.number,
  type: React.PropTypes.string,
  disabled: React.PropTypes.bool,
  onChange: React.PropTypes.func.isRequired
}

export default PercentInput
