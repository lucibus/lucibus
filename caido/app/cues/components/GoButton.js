/*eslint-disable react/prop-types */
import React, {Component} from 'react'
import classNames from 'classnames'

import {Cerebral} from 'common/utils'

export default @Cerebral({
  nextAvailable: ['local', 'cues', 'live', 'next', '$available']
}, {
  nextAvailable: React.PropTypes.bool.isRequired
})
class GoButton extends Component {
  handleClick () {
    if (this.props.nextAvailable) {
      this.props.signals.clickedGoButton()
    }
  }
  render () {
    return (
      <button onClick={this.handleClick.bind(this)} className={classNames('btn', 'btn-primary', {disabled: !this.props.nextAvailable})}>Next Cue</button>
    )

  }
}
