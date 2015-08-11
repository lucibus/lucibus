import React from 'react'
import {round} from 'lodash'

import Component from '../Component'

import NumberPicker from 'react-widgets/lib/NumberPicker'

class Level extends Component {
  render () {
    return (
      <span>@ <NumberPicker value={round(this.props.level * 100, 0)} onChange={this.props.onChange}/></span>
    )
  }
}

Level.propTypes = {
  level: React.PropTypes.number,
  onChange: React.PropTypes.function
}

export default Level
