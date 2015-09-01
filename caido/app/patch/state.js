import _ from 'lodash'

import {newPatchItem} from './utils'

export default {
  local: {
    '$allTags': [
      ['synced', 'patch'],
      patch => _.uniq(_.flatten(_.values(patch)))
    ],
    newPatchItem: newPatchItem(),
    '$newPatchItemValid': [
      ['local', 'newPatchItem'],
      patchItem => patchItem && patchItem.address !== null && patchItem.tags.length > 0
    ]
  }
}
