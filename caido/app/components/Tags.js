import React, {Component} from 'react'
import {Cerebral} from '../utils'

import AutoFillInputReactSelect from '../elements/AutoFillInputReactSelect'

function tagsToOptions (tags) {
  return tags.map(t => ({label: t, value: t}))
}

function optionsToTags (options) {
  return options.map(o => o.value)
}

@Cerebral(props => ({
  allTags: ['local', '$allTags']
}))
class PatchItem extends Component {

  get currentOptions () {
    return tagsToOptions(this.props.tags)
  }

  get options () {
    return tagsToOptions(this.props.allTags)
  }

  onOptionsChange (options) {
    this.props.onChange(optionsToTags(options))
  }

  render () {
    return (
      <AutoFillInputReactSelect
        currentOptions={this.currentOptions}
        options={this.options}
        allowCreate={true}
        onOptionsChange={this.onOptionsChange.bind(this)}
        placeholder='Add tags'
        noResultsText='Add a new tag'
      />
    )
  }
}

PatchItem.propTypes = {
  tags: React.PropTypes.array,
  allTags: React.PropTypes.array,
  onChange: React.PropTypes.func
}
export default PatchItem
