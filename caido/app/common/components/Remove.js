import React, {Component} from 'react'
import classNames from 'classnames'

class Remove extends Component {
  render () {
    return (
      <button className={classNames('btn', 'btn-danger', 'btn-xs', {disabled: this.props.disabled})} onClick={this.props.onClick}>
        –
      </button>
    )
  }
}

Remove.propTypes = {
  onClick: React.PropTypes.func.isRequired,
  disabled: React.PropTypes.bool
}

Remove.defaultPropTypes = {
  disabled: false
}

export default Remove
