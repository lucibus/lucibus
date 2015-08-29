import React, {Component} from 'react'
import dragula from 'react-dragula'
import 'react-dragula/dist/dragula.css'
import classNames from 'classnames'
import {assign} from 'lodash'

import {systemPropType, cerebralPropTypes, Cerebral, getNewSystemPath, systemValid} from '../utils'
import System from '../components/System'
import Add from '../elements/Add'
import Remove from '../elements/Remove'

import styles from './LiveList.css'

const systemsPath = ['synced', 'live', 'systems']
const newSystemPath = getNewSystemPath(systemsPath)

@Cerebral({
  systems: systemsPath,
  newSystem: newSystemPath
})
class LiveList extends Component {
  get listNode () {
    return React.findDOMNode(this.refs.list)
  }

  // after one of the items is dragged around, the dom is updated.
  // so then we can look through the dom to see the list of uuid's of the
  // dom nodes in order, so that we figure out what moved
  get uuidsFromDom () {
    return [].map.call(this.listNode.children, this.uuidFromNode)
  }

  uuidFromNode (node) {
    return node.getAttribute('data-uuid')
  }

  componentDidMount () {
    this.drake = dragula([this.listNode], {
      moves: function (el, container, handle) {
        return handle.classList.contains(styles['drag-handle'])
      }
    })
    this.drake.on('drop', this.onDrop.bind(this))
  }

  // `el` was dropped into `container`, and originally came from `source`
  onDrop (el, container, source) {
    // [].map.call(container.children, e => e.removeAttribute('data-reactid'))

    var uuid = this.uuidFromNode(el)
    var newIndex = this.uuidsFromDom.indexOf(uuid)
    this.props.signals.draggedSystem({uuid: uuid, newIndex: newIndex})
  }

  handleDeleteClick (systemPath) {
    return () => this.props.signals.clickedDeleteSystem({systemPath})
  }

  renderSystem (system, index) {
    var systemPath = systemsPath.concat([index])
    return (
      <li key={system.uuid} data-uuid={system.uuid} className='system-li'>
        <div className={classNames(styles['drag-handle-parent'], 'pull-left', styles['drag-handle'], 'drag-handle')}>
          <span className={classNames('glyphicon', 'glyphicon-menu-hamburger', styles['drag-handle'])}></span>
        </div>
        <System systemPath={systemPath}/>
        <Remove onClick={this.handleDeleteClick(systemPath)} />
      </li>
    )
  }

  handleAddNewClick () {
    if (this.newSystemValid) {
      this.props.signals.clickedAddNewSystem({systemsPath})
    }
  }

  get newSystemValid () {
    return systemValid(this.props.newSystem)
  }

  renderNewSystem () {
    return (
      <li key={this.props.newSystem.uuid} className={styles['new-system']} id='new-system'>
        <System systemPath={newSystemPath}/>
        <Add disabled={!this.newSystemValid} onClick={this.handleAddNewClick.bind(this)} />
      </li>
    )
  }

  render () {
    if (!this.props.newSystem) {
      this.props.signals.needNewSystem({newSystemPath})
    }
    return (
      <div>
        <ol className='list-unstyled' ref='list'>
          {this.props.newSystem ? this.renderNewSystem() : ''}
          {this.props.systems.map(this.renderSystem.bind(this))}
        </ol>
      </div>
    )

  }
}

LiveList.propTypes = assign(
  {},
  {
    systems: React.PropTypes.arrayOf(systemPropType).isRequired,
    newSystem: systemPropType
  },
  cerebralPropTypes
)

export default LiveList
