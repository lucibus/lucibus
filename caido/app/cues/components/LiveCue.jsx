/*eslint-disable react/prop-types */
import React, {Component} from 'react'

import {Cerebral} from 'common/utils'
import AutoFillInputReactSelect from 'common/components/AutoFillInputReactSelect'
import PercentInput from 'common/components/PercentInput'
import CueSystems from './CueSystems'
import GoButton from './GoButton'
import Now from 'time/components/Now'

function cueToOption (cue) {
  return {label: cue.name, value: cue.uuid}
}

export default @Cerebral({
  currentUuid: ['local', 'cues', 'live', 'current', '$uuid'],
  currentIndex: ['local', 'cues', 'live', 'current', '$index'],
  cues: ['synced', 'cues'],
  now: ['local', 'now'],
  percent: ['local', 'cues', 'live', 'current', '$percent']
})
class LiveCue extends Component {
  get options () {
    return this.props.cues.map(cueToOption)
  }

  onValueChange (value) {
    this.props.signals.liveCueChanged({uuid: value})
  }

  onPercentChange (percent) {
    this.props.signals.changedLiveCuePercent({percent})
  }

  shouldComponentUpdate () {
    return true
  }
  render () {
    return (
      <div id='live-cue'>
        <Now />
        Current cue: <AutoFillInputReactSelect
          value={this.props.currentUuid}
          options={this.options}
          multi={false}
          onValueChange={this.onValueChange.bind(this)}
          placeholder='Choose cue'
        />
        <GoButton />
        <PercentInput
          type='range'
          step='0.01'
          float={this.props.percent}
          onChange={this.onPercentChange.bind(this)}
          disabled={this.props.percent === null || this.props.percent === undefined}
        />
        {this.props.currentIndex != null ? <CueSystems cuePath={['synced', 'cues', this.props.currentIndex]} /> : ''}
      </div>
    )
  }
}
