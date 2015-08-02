import React from 'react'
import {Decorator} from 'cerebral-react-baobab'

import Component from '../Component'
import Level from '../elements/Level'

export default @Decorator({
  level: [
    'synced',
    'live',
    'level'
  ]
})
class LiveLevel extends Component {
  render () {
    return (
      <div className='well'>
        <Level description='Grandmaster' level={this.props.level} className='col-lg-2 control-label'/>
      </div>
    )

  }
}

LiveLevel.propTypes = {
  level: React.PropTypes.number
}

