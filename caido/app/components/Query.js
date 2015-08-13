import React from 'react'
import classNames from 'classnames'
import {map, range, assign} from 'lodash'

import Component from '../Component'
import AutoFillInput from '../elements/AutoFillInput'
import {cerebralPropTypes, Cerebral} from '../utils'

class AddressOption {
  constructor (address) {
    this.address = address
    this.asString = 'Address ' + address
  }

  toString () {
    return this.asString
  }
}

@Cerebral(props => ({
  address: props.systemPath.concat(['address'])
}))
class Query extends Component {
  constructor () {
    super()
    this.options = map(range(1, 512 + 1), i => new AddressOption(i))
  }

  onOptionChange (option) {
    this.props.signals.queryChanged({systemPath: this.props.systemPath, address: option.address})
  }

  get queryElement () {
    if (this.systemType === 'address') {
      return <AutoFillInput currentOption={new AddressOption(this.props.address)} options={this.options} onOptionChange={this.onOptionChange.bind(this)}/>
    }
    return <span>Grandmaster</span>
  }

  get systemType () {
    if (this.props.address) {
      return 'address'
    }
    return 'grandmaster'
  }

  get labelType () {
    if (this.systemType === 'address') {
      return 'success'
    }
    return 'primary'
  }

  render () {
    return (
      <div className={classNames('label', 'label-' + this.labelType)}>
        {this.queryElement}
      </div>
    )
  }
}

Query.propTypes = assign({}, cerebralPropTypes, {address: React.PropTypes.number})

export default Query
