import React from 'react'
import classNames from 'classnames'
import {Decorator} from 'cerebral-react-baobab'

import Component from '../Component'
import styles from './Level.css'

@Decorator({
  selectedUuid: ['local', 'selected', 'uuid']
})
class Level extends Component {

  get selected () {
    return this.props.selectedUuid === this.props.uuid
  }

  handleCLick (event) {
    this.props.signals.clickedSystem({uuid: this.props.uuid})
  }

  render () {
    return (
      <p className={styles['level'] + (this.selected ? ' ' + styles['selected'] : '')} onClick={this.handleCLick.bind(this)}>
        <span className={classNames('label', 'label-' + this.props.status)}>{this.props.description}</span> @ <span className='label label-info'>{this.props.level * 100}%</span>
      </p>
    )
  }
}

Level.propTypes = {
  description: React.PropTypes.string,
  status: React.PropTypes.string,
  level: React.PropTypes.number,
  uuid: React.PropTypes.string,
  selectedUuid: React.PropTypes.string,
  signals: React.PropTypes.objectOf(React.PropTypes.function)
}

Level.defaultProps = { status: 'success', selected: false }

export default Level
