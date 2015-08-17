import React from 'react'

import Component from '../Component'
import styles from './System.css'
import Query from './Query'
import Level from './Level'
import {systemPathPropType} from '../utils'

class System extends Component {
  render () {
    return (
      <div className={styles['level'] + ' system'}>
        <Query systemPath={this.props.systemPath} />
        &nbsp;
        <Level systemPath={this.props.systemPath} />
      </div>
    )
  }
}

System.propTypes = {
  systemPath: systemPathPropType
}
export default System
