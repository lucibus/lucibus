import React, {Component} from 'react'
import {map} from 'lodash'
import {ComboBox, Option} from 'belle'

import styles from './AutoFillInput.css'

class AutoFillInput extends Component {

  onUpdate (event) {
    var {identifier} = event // others keys are: value isOptionSelection isMatchingOption
    if (identifier) {
      this.props.onOptionChange(identifier)
    }
  }

  render () {
    var defaultValue = this.props.currentOption ? this.props.currentOption.toString() : null
    return (
      <div className={styles['wrapper']}>
        <ComboBox
          placeholder = {'Add a system'}
          onUpdate={this.onUpdate.bind(this)}
          maxOptions = {5}
          defaultValue={defaultValue}
          enableHint={true}
        >{
          map(this.props.options, (option, index) => {
            return (
              <Option value={option.toString()} identifier={option} key={index}>
                {option.toString()}
              </Option>
            )
          })
          }
        </ComboBox>
      </div>
    )
  }
}

AutoFillInput.propTypes = {
  onOptionChange: React.PropTypes.func.isRequired,
  currentOption: React.PropTypes.object.isRequired,
  options: React.PropTypes.array.isRequired
}

export default AutoFillInput
