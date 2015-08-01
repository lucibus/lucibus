import React, {Component} from 'react'

import Level from '../elements/Level'

export default class SystemItem extends Component {
  render () {
    return (
        <Level description={'Address ' + this.props.address} level={this.props.level} />
    )
  }
}

SystemItem.propTypes = {
  level: React.PropTypes.number,
  address: React.PropTypes.number,
  uuid: React.PropTypes.string
}

