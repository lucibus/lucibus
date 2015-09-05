/*eslint-disable react/prop-types */
import React, {Component} from 'react'

import {Cerebral} from 'common/utils'
import AutoFillInputReactSelect from 'common/components/AutoFillInputReactSelect'

function tagsToOptions (tags) {
  return tags.map(t => ({label: t, value: t}))
}

function optionsToTags (options) {
  return options.map(o => o.value)
}

@Cerebral({
  allTags: ['local', '$allTags']
}, {
  allTags: React.PropTypes.array
})
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
  onChange: React.PropTypes.func
}
export default PatchItem
