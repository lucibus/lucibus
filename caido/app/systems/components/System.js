import React, {Component} from 'react'

import {pathPropType} from 'common/utils'
import Query from './Query'
import Level from './Level'
import styles from './System.css'

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
  systemPath: pathPropType
}
export default System
