import React, {Component} from 'react'

export default class Level extends Component {
  render () {
    return (
      <p>
        <span className='label label-success'>{this.props.description}</span> @ <span className='label label-info'>{this.props.level * 100}%</span>
      </p>
    )
  }
}

Level.propTypes = {
  description: React.PropTypes.string,
  level: React.PropTypes.number
}

