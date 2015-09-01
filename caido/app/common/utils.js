import React from 'react'
import {isEqual} from 'lodash'
import {Mixin} from 'cerebral-react'
import render from 'cerebral-react/src/render'

import UUID from 'uuid-js'

export var cerebralPropTypes = {
  signals: React.PropTypes.objectOf(React.PropTypes.function)
}

export var pathPropType = React.PropTypes.arrayOf(React.PropTypes.string).isRequired

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

export function uuid () {
  return UUID.create().toString()
}
