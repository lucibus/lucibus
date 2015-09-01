import React, {Component} from 'react'
import Multiselect from 'react-widgets/lib/Multiselect'
import 'react-widgets/lib/less/react-widgets.less'
import {test as testFuzzy} from 'fuzzy'

import styles from './AutoFillInput.css'

class AutoFillInput extends Component {

  render () {
    return (
      <div className={styles['wrapper']}>
        <Multiselect
          data={this.props.options}
          value={this.props.currentOptions}
          onChange={this.props.onOptionsChange}
          placeholder='Add a system'
          textField='label'
          filter={(option, search) => {
            return testFuzzy(search, option.label)
          }}
        />
      </div>
    )
  }
}

AutoFillInput.propTypes = {
  onOptionsChange: React.PropTypes.func.isRequired,
  currentOptions: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  options: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
}

export default AutoFillInput
