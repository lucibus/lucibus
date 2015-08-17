import React from 'react'
import dragula from 'react-dragula'
import 'react-dragula/dist/dragula.css'
import classNames from 'classnames'
import {assign} from 'lodash'

import Component from '../Component'
import System from '../components/System'
import styles from './LiveList.css'
import {systemPropType, cerebtralPropTypes, Cerebral} from '../utils'

const systemsPath = ['synced', 'live', 'systems']

@Cerebral(() => ({
  systems: systemsPath,
  newSystemValid: ['local', '$newSystemValid'],
  newSystemUuid: ['local', 'newSystem', 'uuid']
}))
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
      <li key={system.uuid} data-uuid={system.uuid}>
        <div className={classNames(styles['drag-handle-parent'], 'pull-left', styles['drag-handle'])}>
          <span className={classNames('glyphicon', 'glyphicon-menu-hamburger', styles['drag-handle'])}></span>
        </div>
        <System systemPath={systemPath}/>
        <button className='btn btn-danger btn-xs' onClick={this.handleDeleteClick(systemPath)}>
          –
        </button>
      </li>
    )
  }

  handleAddNewClick () {
    if (this.props.newSystemValid) {
      this.props.signals.clickedAddNewSystem()
    }
  }

  render () {
    return (
      <div>
        <ol className='list-unstyled' ref='list'>
          {this.props.systems.map(this.renderSystem.bind(this))}
          <li key={this.props.newSystemUuid} className={styles['new-system']} id='new-system'>
            <System systemPath={['local', 'newSystem']}/>
            <button className={classNames('btn', 'btn-primary', 'btn-xs', {disabled: !this.props.newSystemValid})} onClick={this.handleAddNewClick.bind(this)}>
              +
            </button>
          </li>
        </ol>
      </div>
    )

  }
}

LiveList.propTypes = assign(
  {},
  {
    systems: React.PropTypes.arrayOf(systemPropType).isRequired,
    newSystemValid: React.PropTypes.bool.isRequired,
    newSystemUuid: React.PropTypes.string.isRequired
  },
  cerebtralPropTypes
)

export default LiveList
