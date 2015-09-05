/*eslint-disable react/prop-types */
import React, {Component} from 'react'
import classNames from 'classnames'
import 'octicons/octicons/octicons.css'

import CueName from './CueName'
import CueSystems from './CueSystems'
import CueDuration from './CueDuration'
import styles from './Cue.css'
import {getCueExpandedPath} from '../utils'
import {Cerebral} from 'common/utils'

export default @Cerebral(props => ({
  expanded: getCueExpandedPath(props.cuePath)
}), {
  expanded: React.PropTypes.bool
})
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
        <CueDuration cuePath={this.props.cuePath}/>
        {this.props.children}
        {expanded ? <CueSystems cuePath={this.props.cuePath}/> : ''}
      </div>
    )
  }
}
