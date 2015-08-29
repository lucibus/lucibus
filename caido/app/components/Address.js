import React, {Component} from 'react'

import styles from './Address.css'

class Address extends Component {

  render () {
    return (
      <input
        type='number'
        value={this.props.address}
        onChange={event => this.props.onChange(parseInt(event.target.value, 10))}
        max='512'
        min='1'
        className={styles['hidden-input']}
      />
    )
  }
}

Address.propTypes = {
  address: React.PropTypes.number,
  onChange: React.PropTypes.func,
  onTagsChange: React.PropTypes.func
}
export default Address
