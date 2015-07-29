import React, {Component} from 'react'
import {branch} from 'baobab-react/decorators'
import PropTypes from 'baobab-react/prop-types'

import Level from '../elements/Level'
import ModifyLevel from './ModifyLevel'

export default @branch({
  cursors: {
    level: ['live', 'level']
  }
})
class LiveLevel extends Component {
  static contextTypes = {
    tree: PropTypes.baobab,
    cursors: PropTypes.cursors
  }

  onChange (newValue) {
    this.context.cursors.level.set(newValue)
    this.context.tree.commit()
  }

  render () {
    return (
      <div className='well'>
        <Level description='Grandmaster' level={this.props.level} className='col-lg-2 control-label'/>
        <div className='col-lg-10'>
          <ModifyLevel level={this.props.level} onChange={this.onChange.bind(this)}/>
        </div>
      </div>
    )

  }
}

LiveLevel.propTypes = {
  level: React.PropTypes.number
}

