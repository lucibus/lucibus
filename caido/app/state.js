import {merge} from 'lodash'

import app from 'app/state'
import cues from 'cues/state'
// import common from 'common/state'
// import live from 'live/state'
import patch from 'patch/state'
import sync from 'sync/state'
import systems from 'systems/state'
import time from 'time/state'

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
export default merge({}, ...modules)
