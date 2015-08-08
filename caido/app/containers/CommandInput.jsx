import React from 'react'
import {Decorator} from 'cerebral-react-baobab'

import Component from '../Component'

@Decorator()
class CommandInput extends Component {
  render () {
    return (
      <p onClick={() => this.props.signals.clickedAddAddressOne()}>
        Click to add address 1 to the stack.
      </p>
    )
  }
}

CommandInput.propTypes = {
  signals: React.PropTypes.objectOf(React.PropTypes.function)
}

export default CommandInput
