import React, {Component} from 'react'
import classNames from 'classnames'
import {map, range, assign} from 'lodash'

import AutoFillInputReactSelect from '../elements/AutoFillInputReactSelect'
import {cerebralPropTypes, Cerebral} from '../utils'

function optionsToQuery (options) {
  return options.map(o => JSON.parse(o.value))
}

function queryToOptions (query) {
  return query.map(o => {
    var isAddress = o.hasOwnProperty('address')
    return {
      label: isAddress ? `Address ${o.address}` : o.tag,
      value: JSON.stringify(o)
    }
  })
}

@Cerebral(props => ({
  query: props.systemPath.concat(['query']),
  allTags: ['local', '$allTags']
}))
class Query extends Component {
  constructor () {
    super()
  }

  onOptionsChange (options) {
    var query = optionsToQuery(options)
    this.props.signals.queryChanged({systemPath: this.props.systemPath, query: query})
  }

  get currentOptions () {
    return queryToOptions(this.props.query || [])
  }

  get options () {
    var allAddressQuery = map(range(1, 512 + 1), address => ({address}))
    var allTagQuery = map(this.props.allTags, tag => ({tag}))
    var allQuery = allTagQuery.concat(allAddressQuery)
    return queryToOptions(allQuery)
  }

  get queryElement () {
    if (this.systemType === 'filter') {
      return <AutoFillInputReactSelect currentOptions={this.currentOptions} options={this.options} onOptionsChange={this.onOptionsChange.bind(this)}/>
    }
    return <span>Grandmaster</span>
  }

  get systemType () {
    if (this.props.systemPath[this.props.systemPath.length - 1] === 'live') {
      return 'grandmaster'
    }
    return 'filter'
  }

  get labelType () {
    if (this.systemType === 'filter') {
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

Query.propTypes = assign({}, cerebralPropTypes, {
  allTags: React.PropTypes.arrayOf(React.PropTypes.string),
  query: React.PropTypes.arrayOf(React.PropTypes.oneOf([
    React.PropTypes.shape({
      'address': React.PropTypes.number
    }),
    React.PropTypes.shape({
      'tag': React.PropTypes.string
    })
  ]))
})

export default Query
