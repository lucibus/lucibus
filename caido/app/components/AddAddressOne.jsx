import React, {Component} from 'react'
import {branch} from 'baobab-react/decorators'
import PropTypes from 'baobab-react/prop-types'
import UUID from 'uuid-js'

export default @branch({
  cursors: {
    systems: ['live', 'systems']
  }
})
class AddAddressOne extends Component {
  static contextTypes = {
    tree: PropTypes.baobab,
    cursors: PropTypes.cursors
  }

  handleClick () {
    this.context.cursors.systems.push({
      'level': 0.5,
      'address': 1,
      'uuid': UUID.create().toString()
    })
    this.context.tree.commit()
  }

  render () {
    return (
      <p onClick={this.handleClick.bind(this)}>
        Click to add address 1 to the stack.
      </p>
    )
  }
}
