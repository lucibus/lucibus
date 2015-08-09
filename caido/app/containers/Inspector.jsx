import React from 'react'
// import classNames from 'classnames'
import {Decorator} from 'cerebral-react-baobab'

import Component from '../Component'
import styles from './Inspector.css'

@Decorator({
  liveLevel: ['synced', 'live', 'level'],
  systems: ['synced', 'live', 'systems'],
  uuid: ['local', 'selected', 'uuid']
})
class Inspector extends Component {

  get level () {
    if (this.props.uuid === 'live') {
      return this.props.liveLevel
    }
    return this.props.systems.find(s => s.uuid === this.props.uuid).level
  }

  handleChange (event) {
    this.props.signals.movedInspector({uuid: this.props.uuid, level: event.currentTarget.value})
  }

  render () {
    return (
      <div>
        <input type='range' min='0' max='1' step='0.01' value={this.level} className={styles['range']} onChange={this.handleChange.bind(this)} />
      </div>
    )
  }
}

Inspector.propTypes = {
  uuid: React.PropTypes.objectOf(React.PropTypes.any),
  systems: React.PropTypes.any,
  liveLevel: React.PropTypes.number,
  signals: React.PropTypes.objectOf(React.PropTypes.function)
}

export default Inspector
