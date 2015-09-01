import React, {Component} from 'react'
import classNames from 'classnames'
import 'octicons/octicons/octicons.css'

import CueName from './CueName'
import CueSystems from './CueSystems'
import styles from './Cue.css'
import {getCueExpandedPath} from '../utils'
import {cerebralPropTypes, Cerebral} from 'common/utils'

@Cerebral(props => ({
  expanded: getCueExpandedPath(props.cuePath)
}))
class Cue extends Component {
  handleCollapseClick () {
    this.props.signals.clickedToggleExpandCue({expandedCuePath: getCueExpandedPath(this.props.cuePath)})
  }

  render () {
    var expanded = this.props.expanded
    return (
      <div>
        <div className={styles['collapsable']} onClick={this.handleCollapseClick.bind(this)}>
          <span className={classNames('octicon', expanded ? 'octicon-chevron-down' : 'octicon-chevron-right')}></span>
        </div>
        <CueName cuePath={this.props.cuePath}/>
        {this.props.children}
        {expanded ? <CueSystems cuePath={this.props.cuePath}/> : ''}
      </div>
    )
  }
}

Cue.propTypes = Object.assign(
  {},
  {
    cuePath: React.PropTypes.array.isRequired,
    expanded: React.PropTypes.bool.isRequired
  },
  cerebralPropTypes
)

export default Cue
