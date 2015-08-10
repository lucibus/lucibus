import React from 'react'
import classNames from 'classnames'

import Component from '../Component'

class Query extends Component {
  render () {
    return (
      <span className={classNames('label', 'label-' + this.props.status)}>{this.props.description}</span>
    )
  }
}

Query.propTypes = {
  description: React.PropTypes.string,
  status: React.PropTypes.string
}

Query.defaultProps = {status: 'success'}

export default Query
