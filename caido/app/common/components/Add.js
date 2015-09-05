import React, {Component} from 'react'
import classNames from 'classnames'

class Add extends Component {

  handleClick () {
    if (!this.props.disabled) {
      this.props.onClick()
    }
  }

  render () {
    return (
      <button className={classNames('btn', 'btn-primary', 'btn-xs', {disabled: this.props.disabled})} onClick={this.handleClick.bind(this)}>
        +
      </button>
    )
  }
}

Add.propTypes = {
  onClick: React.PropTypes.func.isRequired,
  disabled: React.PropTypes.bool
}

Add.defaultPropTypes = {
  disabled: false
}

export default Add
