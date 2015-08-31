import React, {Component} from 'react'
import {assign} from 'lodash'

import {cerebralPropTypes, Cerebral} from '../utils'
import AutoFillInputReactSelect from '../elements/AutoFillInputReactSelect'
import CueSystems from '../components/CueSystems'
import GoButton from '../components/GoButton'

function cueToOption (cue) {
  return {label: cue.name, value: cue.uuid}
}

@Cerebral({
  cueIndex: ['local', '$liveCueIndex'],
  uuid: ['synced', 'live', 'cue'],
  cues: ['synced', 'cues']
})
class LiveCue extends Component {
  get options () {
    return this.props.cues.map(cueToOption)
  }

  onValueChange (value) {
    this.props.signals.liveCueChanged({uuid: value})
  }

  render () {
    return (
      <div id='live-cue'>
        Current cue: <AutoFillInputReactSelect
          value={this.props.uuid}
          options={this.options}
          multi={false}
          onValueChange={this.onValueChange.bind(this)}
          placeholder='Choose cue'
        />
        <GoButton />
        {this.props.uuid ? <CueSystems cuePath={['synced', 'cues', this.props.cueIndex]} /> : ''}
      </div>
    )
  }
}

LiveCue.propTypes = assign(
  {},
  {
    cueIndex: React.PropTypes.number,
    uuid: React.PropTypes.string,
    cues: React.PropTypes.array.isRequired
  },
  cerebralPropTypes
)
export default LiveCue
