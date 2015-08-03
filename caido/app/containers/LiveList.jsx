import React from 'react'
import {Decorator} from 'cerebral-react-baobab'
import dragula from 'dragula'
import classNames from 'classnames'

import Component from '../Component'
import SystemItem from '../components/SystemItem'
import AddAddressOne from './AddAddressOne'
import styles from './LiveList.css'

export default @Decorator({
  systems: ['synced', 'live', 'systems']
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
    //[].map.call(container.children, e => e.removeAttribute('data-reactid'))

    var uuid = this.uuidFromNode(el)
    var newIndex = this.uuidsFromDom.indexOf(uuid)
    this.props.signals.draggedSystem({uuid: uuid, newIndex: newIndex})
  }

  renderSystem (system) {
    return (
      <li key={system.uuid} data-uuid={system.uuid}>
        <div className={classNames(styles['drag-handle-parent'], 'pull-left', styles['drag-handle'])}>
          <span className={classNames('glyphicon', 'glyphicon-menu-hamburger', styles['drag-handle'])}></span>
        </div>
        <SystemItem {...system} />
      </li>
    )
  }

  render () {
    console.log('rerendering')
    return (
      <div>
        <ol className='list-unstyled' ref='list'>
          {this.props.systems.map(this.renderSystem.bind(this))}
        </ol>
        <AddAddressOne />
      </div>
    )

  }
}

LiveList.propTypes = {
  systems: React.PropTypes.arrayOf(React.PropTypes.shape(SystemItem.propTypes)),
  signals: React.PropTypes.objectOf(React.PropTypes.function)
}
