import React, {Component} from 'react'
import Systems from 'systems/components/Systems'

class Cue extends Component {
  render () {
    return (
      <Systems systemsPath={this.props.cuePath.concat(['systems'])} />
    )
  }
}

Cue.propTypes = {
  cuePath: React.PropTypes.array.isRequired
}

export default Cue
