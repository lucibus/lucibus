import React from 'react'
import {assign, isEqual} from 'lodash'
import {Mixin} from 'cerebral-react-baobab'
import UUID from 'uuid-js'

export var cerebralPropTypes = {
  signals: React.PropTypes.objectOf(React.PropTypes.function)
}

export var systemPropType = React.PropTypes.shape({
    level: React.PropTypes.number.isRequired,
    systems: React.PropTypes.arrayOf(React.PropTypes.object),
    address: React.PropTypes.number
  })

export var systemPathPropType = React.PropTypes.arrayOf(React.PropTypes.string).isRequired

export var systemPropTypes = {
  system: systemPropType.isRequired,
  systemPath: systemPathPropType
}

export var cerebralAndSystemPropTypes = assign({}, cerebralPropTypes, systemPropTypes)

// copied from https://github.com/christianalfoni/cerebral-react-baobab/blob/7ffeb7be101335afeb5bcd87fa5ce822df215330/index.js#L163-L184
var Render = function (Component) {
  return function () {
    var state = this.state || {}
    var props = this.props || {}

    var propsToPass = Object.keys(state).reduce(function (props, key) {
      props[key] = state[key]
      return props
    }, {})

    propsToPass = Object.keys(props).reduce(function (propsToPass, key) {
      propsToPass[key] = props[key]
      return propsToPass
    }, propsToPass)

    propsToPass.signals = this.signals
    propsToPass.recorder = this.recorder
    propsToPass.get = this.get

    return React.createElement(Component, propsToPass)
  }
}

delete Mixin['shouldComponentUpdate']
export function Cerebral (propsToPaths) {
  propsToPaths = propsToPaths || () => ({})
  return function (Component) {
    return React.createClass({
      displayName: Component.name + 'Container',
      mixins: [Mixin],
      getStatePaths: function () {
        return propsToPaths(this.props)
      },
      render: Render(Component),
      shouldComponentUpdate: function (nextProps, nextState) {
        return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState)
      }
    })
  }
}


export function newSystem () {
  return {'uuid': UUID.create().toString()}
}
