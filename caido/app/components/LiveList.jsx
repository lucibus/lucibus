import React, {Component} from 'react'
import {branch} from 'baobab-react/decorators'
import PropTypes from 'baobab-react/prop-types'
import dragula from 'dragula'

import SystemItem from './SystemItem'
import AddAddressOne from './AddAddressOne'
// import Level from '../elements/Level'

export default @branch({
  cursors: {
    systems: ['live', 'systems']
  }
})
class LiveList extends Component {
  static contextTypes = {
    tree: PropTypes.baobab,
    cursors: PropTypes.cursors
  }

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
    this.drake = dragula([this.listNode])
    this.drake.on('drop', this.onDrop.bind(this))
  }

  // `el` was dropped into `container`, and originally came from `source`
  onDrop (el, container, source) {
    var uuid = this.uuidFromNode(el)

    // delete this system from its old index and add it to its new one
    var previousIndex = this.props.systems.map(e => e.uuid).indexOf(uuid)
    var system = this.props.systems[previousIndex]
    var newIndex = this.uuidsFromDom.indexOf(uuid)
    this.context.cursors.systems.splice([[previousIndex, 1], [newIndex, 0, system]])
    //debugger
    this.context.tree.commit()
  }

  // componentDidUpdate () {
  //   //this.drake.destroy()
  //   //this.drake = dragula([listNode])
  //   //console.log(listNode)
  //   window.dragula = dragula
  // }

  render () {
    return (
      <div>
        <ol className='list-group' ref='list'>
          {this.props.systems.map(function (system, index) {
            return (
              <li key={system.uuid} data-uuid={system.uuid} className='list-group-item'>
                <SystemItem {...system} />
              </li>
            )
          })}
        </ol>
        <AddAddressOne />
      </div>
    )

  }
}

LiveList.propTypes = {
  systems: React.PropTypes.arrayOf(React.PropTypes.shape(SystemItem.propTypes))
}

          // <li className='list-group-item'>
          //   <Level description='Grandmaster' level={this.props.live.level} className='col-lg-2 control-label'/>
          // </li>
