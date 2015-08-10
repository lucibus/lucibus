import React from 'react'
import {Decorator} from 'cerebral-react-immutable-store'
import {Multiselect} from 'react-widgets'
import 'react-widgets/lib/less/react-widgets.less'
import {range, map, isFunction, omit, round} from 'lodash'
import {test as testFuzzy} from 'fuzzy'

import Component from '../Component'
import Query from '../elements/Query'
import Level from '../elements/Level'

import styles from './Command.css'

class TagItem extends Component {
  render () {
    var system = this.props.item
    var isAddress = system.hasOwnProperty('address')

    return (
      <span className={styles['tag-item']}>
        {isAddress ? <Query description={'Address ' + system.address} /> : <Level level={system.level} />}
      </span>
    )
  }
}

TagItem.propTypes = {
  item: React.PropTypes.shape({
    address: React.PropTypes.number,
    level: React.PropTypes.number
  }).isRequired
}

@Decorator({
  inputValue: [
    'local',
    'controller',
    'input'
  ],
  system: [
    'local',
    'controller',
    '$system'
  ],
  terms: [
    'local',
    'controller',
    'terms'
  ]
})
class Command extends Component {

  get data () {
    if (!this.props.system.hasOwnProperty('address')) {
      return this.addressOptions
    }
    if (!this.props.system.hasOwnProperty('level')) {
      return this.levelOptions
    }
    return this.enterOptions
  }

  get addressOptions () {
    return map(range(1, 512 + 1), function (i) {
      return {
        address: i,
        toString: function () {return 'Address ' + this.address}
      }
    })
  }

  get levelOptions () {
    return map(range(0, 1.01, 0.01), function (i) {
      return {
        level: i,
        toString: function () {return '@ ' + round(i * 100, 0) + '%'}
      }
    })
  }

  get enterOptions () {
    return [{enter: true, toString: () => 'Add this system'}]
  }

  handleChange (value) {
    var valueWithoutFunctions = map(value, v => omit(v, isFunction))
    this.props.signals.controllerChanged({terms: valueWithoutFunctions})
  }

  handleSearch (searchTerm) {
    console.log(searchTerm)
    this.props.signals.controllerSearched({value: searchTerm})
  }

  render () {
    return (
      <div>
        <Multiselect
          data={this.data}
          value={this.props.terms}
          tagComponent={TagItem}
          filter={(option, search) => testFuzzy(search, option.toString())}
          minLength={0}
          searchTerm={this.props.inputValue}
          onChange={this.handleChange.bind(this)}
          onSearch={this.handleSearch.bind(this)}
          defaultOpen={true}
          placeholder='Command prompt...'
          // onFocus={(event) => console.log(event)}
          // filterOption='toString'
          // displayOption={function (option, index) {return 'Address ' + option.address}}
          // maxVisible={4}
          // value={this.props.inputValue}
          // inputProps={{autoFocus: true}}
        />
      </div>
    )
  }
}

Command.propTypes = {
  signals: React.PropTypes.objectOf(React.PropTypes.function),
  inputValue: React.PropTypes.string,
  system: React.PropTypes.objectOf(React.PropTypes.any),
  terms: React.PropTypes.arrayOf(React.PropTypes.any)
}

export default Command
