import React, {Component} from 'react'
import {assign} from 'lodash'

import {cerebralPropTypes, Cerebral} from 'common/utils'
import Cue from './Cue'
import Add from 'common/components/Add'
import Remove from 'common/components/Remove'

@Cerebral({
  cues: ['synced', 'cues'],
  newCueUuid: ['local', 'newItem', 'uuid'],
  newCueValid: ['local', '$newCueValid']
})
class Cues extends Component {

  render () {
    return (
      <div className='col-lg-12' id='cues'>
        <h2>Cues</h2>
        <ul className='list-unstyled'>
          {this.props.cues.map(({uuid}, index) => {
            var cuePath = ['synced', 'cues', index]
            return (
              <li key={uuid}>
                <Cue cuePath={cuePath}>
                  <Remove
                    onClick={() => this.props.signals.clickedRemoveCue({cuePath})}
                  />
                </Cue>
              </li>
            )
          })}
          <li key={this.props.newCueUuid}>
            <Cue cuePath={['local', 'newCue']}>
              <Add
                disabled={!this.props.newCueValid}
                onClick={this.props.signals.clickedAddNewCue}
              />
            </Cue>
          </li>
        </ul>
      </div>
    )
  }
}

Cues.propTypes = assign(
  {},
  {
    cues: React.PropTypes.array.isRequired,
    newCueUuid: React.PropTypes.string.isRequired,
    newCueValid: React.PropTypes.bool.isRequired
  },
  cerebralPropTypes
)

export default Cues
