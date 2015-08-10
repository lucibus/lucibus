import UUID from 'uuid-js'

function addSystem (args, state) {
  var {system} = args
  const uuid = UUID.create().toString()
  state.push(['synced', 'live', 'systems'],
    Object.assign({'uuid': uuid}, system)
  )
}

addSystem.input = {
  system: Object
}

export default addSystem
