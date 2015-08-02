import UUID from 'uuid-js'

export default function addSystem (args, state) {
  const uuid = UUID.create().toString()
  console.log(state)
  state.push(['synced', 'live', 'systems'],
    Object.assign({'uuid': uuid}, args)
  )
}
