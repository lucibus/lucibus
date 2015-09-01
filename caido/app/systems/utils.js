import React from 'react'

import {uuid} from 'common/utils'

export var systemPropType = React.PropTypes.shape({
  level: React.PropTypes.number.isRequired,
  systems: React.PropTypes.arrayOf(React.PropTypes.object),
  address: React.PropTypes.number
})

export function newSystem () {
  return {'uuid': uuid()}
}

export function systemValid (system) {
  return (system.query || []).length > 0 && system.hasOwnProperty('level')
}

export function getNewSystemPath (systemsPath) {
  return ['local', 'newSystems', JSON.stringify(systemsPath)]
}
