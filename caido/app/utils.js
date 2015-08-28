import React from 'react'
import {assign, isEqual} from 'lodash'
import {Mixin} from 'cerebral-react'
import render from 'cerebral-react/src/render'

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

delete Mixin['shouldComponentUpdate']

// copied from https://github.com/christianalfoni/cerebral-react/blob/2933e03b0a72e2073f26a86dcb66b42c7c867d32/src/decorator.js#L5-L19
export function Cerebral (paths) {
  return function (Component) {
    return React.createClass({
      displayName: Component.name + 'Container',
      mixins: [Mixin],
      function (nextProps, nextState) {
        return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState)
      },
      getStatePaths: function () {
        if (!paths) {
          return {}
        }
        return typeof paths === 'function' ? paths(this.props) : paths
      },
      render: render(Component)
    })
  }
}

export function newSystem () {
  return {'uuid': UUID.create().toString()}
}
