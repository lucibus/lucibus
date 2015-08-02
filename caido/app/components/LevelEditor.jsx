import React from 'react'
import Component from '../Component'

export default class LevelEditor extends Component {
  render () {
    return (
      <div>
        <input type='range' min='0' max='1' step='0.01' value={this.props.level} onChange={this.onChange.bind(this)} />
      </div>
    )

  }
}

LevelEditor.propTypes = {
  level: React.PropTypes.number,
  onChange: React.PropTypes.func
}

