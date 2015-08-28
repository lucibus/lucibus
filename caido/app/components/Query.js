import React, {Component} from 'react'
import classNames from 'classnames'
import {map, range, assign} from 'lodash'

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

  get currentOption () {
    if (this.props.address) {
      return new AddressOption(this.props.address)
    }
    return null
  }

  get queryElement () {
    if (this.systemType === 'address') {
      return <AutoFillInput currentOption={this.currentOption} options={this.options} onOptionChange={this.onOptionChange.bind(this)}/>
    }
    return <span>Grandmaster</span>
  }

  get systemType () {
    if (this.props.systemPath[this.props.systemPath.length - 1] === 'live') {
      return 'grandmaster'
    }
    return 'address'
  }

  get labelType () {
    if (this.systemType === 'address') {
      return 'success'
    }
    return 'primary'
  }

  render () {
    return (
      <div className={classNames('label', 'label-' + this.labelType, 'query')}>
        {this.queryElement}
      </div>
    )
  }
}

Query.propTypes = assign({}, cerebralPropTypes, {address: React.PropTypes.number})

export default Query
