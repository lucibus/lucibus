import React, {Component} from 'react'
import {branch} from 'baobab-react/decorators'
import dragula from 'dragula'

import SystemItem from './SystemItem'
import AddAddressOne from './AddAddressOne'
// import Level from '../elements/Level'

export default @branch({
  cursors: {
    live: ['live']
  }
})
class LiveList extends Component {
  componentDidMount () {
    var listNode = React.findDOMNode(this).children[0]
    this.drake = dragula([listNode])
    this.drake.on('drop', function(a, b, c){console.log(a, b, c)})
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
        <ol className='list-group'>
          {this.props.live.systems.map(function (system, index) {
            return (
              <li className='list-group-item'>
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
  live: React.PropTypes.shape({
    level: React.PropTypes.number,
    systems: React.PropTypes.arrayOf(React.PropTypes.shape(SystemItem.propTypes))
  })
}

          // <li className='list-group-item'>
          //   <Level description='Grandmaster' level={this.props.live.level} className='col-lg-2 control-label'/>
          // </li>
