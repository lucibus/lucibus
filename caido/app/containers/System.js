import React from 'react'
import {Decorator} from 'cerebral-react-baobab'

import Component from '../Component'
import styles from './System.css'
import Query from '../elements/Query'
import Level from '../elements/Level'

@Decorator({
  selectedUuid: ['local', 'selected', 'uuid']
})
class System extends Component {

  get selected () {
    return this.props.selectedUuid === this.props.uuid
  }

  handleCLick (event) {
    this.props.signals.clickedSystem({uuid: this.props.uuid})
  }

  handleLevelChange (level) {
    this.props.signals.levelChanged({uuid: this.props.uuid, level: level / 100})
  }

  render () {
    return (
      <p className={styles['level'] + (this.selected ? ' ' + styles['selected'] : '')} onClick={this.handleCLick.bind(this)}>
        <Query description={this.props.description} status={this.props.status}/> <Level level={this.props.level} onChange={this.handleLevelChange.bind(this)}/>
      </p>
    )
  }
}

System.propTypes = {
  description: React.PropTypes.string,
  status: React.PropTypes.string,
  level: React.PropTypes.number,
  uuid: React.PropTypes.string,
  selectedUuid: React.PropTypes.string,
  signals: React.PropTypes.objectOf(React.PropTypes.function)
}

export default System
