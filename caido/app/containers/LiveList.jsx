import React, {Component} from 'react'
import Systems from '../components/Systems'

class LiveList extends Component {
  render () {
    return (
      <Systems systemsPath={['synced', 'live', 'systems']} />
    )

  }
}

export default LiveList
