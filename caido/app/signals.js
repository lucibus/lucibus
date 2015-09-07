import app from 'app/signals'
import cues from 'cues/signals'
// import common from 'common/signals'
// import live from 'live/signals'
import patch from 'patch/signals'
import sync from 'sync/signals'
import systems from 'systems/signals'
import time from 'time/signals'

const modules = [
  app,
  cues,
  // common,
  // live,
  patch,
  sync,
  systems,
  time
]

export default function registerSignals (controller) {
  for (var signals of modules) {
    for (var signalName in signals) {
      var actions = signals[signalName]
      controller.signal(signalName, ...actions)
    }
  }
}
