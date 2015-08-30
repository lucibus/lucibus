import React, {Component} from 'react'
import Select from 'react-select'
import fuzzy from 'fuzzy'
import _ from 'lodash'

import './AutoFillInputReactSelect.less'
import styles from './AutoFillInputReactSelect.css'

class AutoFillInputReactSelect extends Component {

  // returns Array filteredOptions. Will override filterOption, matchPos, matchProp and ignoreCase options.
  filterOptions (options, filter, currentValues) {
    // exclude currentValue from options
    var optionsExcluded = _.filter(options, o => !_.includes(currentValues, o.value))
    var results = fuzzy.filter(filter, optionsExcluded, {extract: o => o.label})
    var slicedResults = _.slice(results, 0, 5)
    var filteredOptions = slicedResults.map(r => r.original)
    return filteredOptions
  }

  render () {
    return (
      <div className={styles['wrapper']}>
        <Select
          multi={true}
          options={this.props.options}
          // values={this.props.currentOptions}
          value={this.props.currentOptions.map(o => o.value).join('`')}
          delimiter='`'
          onChange={(value, values) => this.props.onOptionsChange(values)}
          filterOptions={this.filterOptions}
          placeholder={this.props.placeholder}
          allowCreate={this.props.allowCreate}
          multi={this.props.multi}
          noResultsText={this.props.noResultsText}
        />
      </div>
    )
  }
}

AutoFillInputReactSelect.propTypes = {
  onOptionsChange: React.PropTypes.func.isRequired,
  currentOptions: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  options: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  allowCreate: React.PropTypes.bool
  multi: React.PropTypes.bool,
  placeholder: React.PropTypes.string.isRequired,
  noResultsText: React.PropTypes.string
}

AutoFillInputReactSelect.defaultPropTypes = {
  allowCreate: false
  multi: true,
  noResultsText: 'No results found'
}

export default AutoFillInputReactSelect
