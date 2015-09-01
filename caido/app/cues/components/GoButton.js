import React, {Component} from 'react'
import classNames from 'classnames'
import {assign} from 'lodash'

import {cerebralPropTypes, Cerebral} from 'common/utils'

@Cerebral({
  hasNextCue: ['local', '$hasNextCue']
})
class GoButton extends Component {
  handleClick () {
    this.props.signals.clickedGoButton()
  }
  render () {
    return (
      <button onClick={this.handleClick.bind(this)} className={classNames('btn', 'btn-primary', {disabled: !this.props.hasNextCue})}>Next Cue</button>
    )

  }
}

GoButton.propTypes = assign(
  {},
  {
    hasNextCue: React.PropTypes.bool.isRequired
  },
  cerebralPropTypes
)

export default GoButton
