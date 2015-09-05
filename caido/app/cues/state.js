import _ from 'lodash'

import {nullIfNotFound} from 'common/utils'
import {parse} from 'time/utils'
import {newCue} from './utils'

export default {
  local: {
    cues: {
      new: newCue(),
      $newValid: [
        ['local', 'cues', 'new'],
        ['local', 'cues', '$allNames'],
        (cue, allCueNames) => cue && (cue.name || '').length > 0 && !_.includes(allCueNames, cue.name)
      ],
      $count: [
        ['synced', 'cues'],
        cues => (cues || []).length
      ],
      $maxIndex: [
        ['local', 'cues', '$count'],
        count => count - 1
      ],
      expanded: {},
      $allNames: [
        ['synced', 'cues'],
        (cues = []) => cues.map(p => p.name)
      ],
      live: {
        current: {
          $uuid: [
            ['synced', 'live', 'cue'],
            currentCue => currentCue ? currentCue.uuid || '' : ''
          ],
          $duration: [
            ['local', 'cues', 'live', 'current', '$uuid'],
            ['synced', 'cues'],
            (uuid, cues) => uuid ? _.find(cues, {uuid}).duration : null
          ],
          $index: [
            ['local', 'cues', 'live', 'current', '$uuid'],
            ['synced', 'cues'],
            (uuid, cues) => nullIfNotFound(_.findIndex(cues, {uuid}))
          ],
          $percent: [
            ['synced', 'live', 'cue', 'percent'],
            ['synced', 'live', 'cue', 'time'],
            ['local', 'now'],
            ['local', 'cues', 'live', 'current', '$duration'],
            (percent, startTime, now, duration) => {
              if (startTime) {
                var elapsedMS = parse(now).diff(parse(startTime))
                percent = elapsedMS / duration
                if (percent > 1) {
                  percent = 1
                }
                if (percent < 0) {
                  percent = 0
                }
              }
              return percent
            }
          ]
        },
        next: {
          $index: [
            ['local', 'cues', 'live', 'current', '$index'],
            currentIndex => currentIndex === null ? 0 : currentIndex + 1
          ],
          $available: [
            ['local', 'cues', 'live', 'next', '$index'],
            ['local', 'cues', '$maxIndex'],
            (index, maxIndex) => index <= maxIndex
          ],
          $uuid: [
            ['local', 'cues', 'live', 'next', '$index'],
            ['synced', 'cues'],
            (index, cues) => cues ? (cues[index] || {uuid: ''}).uuid : ''
          ]
        }
      }
    }
    // }a
    // '$liveCueUuid': [
    //   ['synced', 'live', 'cue'],
    //   liveCue => liveCue.uuid || null
    // ],
    // '$liveCueIndex': [
    //   ['local', '$liveCueUuid'],
    //   ['synced', 'cues'],
    //   (uuid, cues = []) => _.findIndex(cues, {uuid})
    // ],
    // '$currentCue': [
    //   ['local', '$liveCueUuid'],
    //   ['synced', 'cues'],
    //   (uuid, cues = []) => _.find(cues, {uuid})
    // ],
    // '$liveCuePercent': [
    //   ['synced', 'live', 'cue'],
    //   ['local', '$currentCue'],
    //   ['local', 'time'],
    //   (liveCue, currentCue, now) => {
    //     liveCue.percent || currentCue.duration
    //   }
    // ],
    // '$currentCueDuration': [

    // ]
    // '$allCueNames': [
    //   ['synced', 'cues'],
    //   (cues = []) => cues.map(p => p.name)
    // ],
    // '$newCueValid': [
    //   ['local', 'newCue'],
    //   ['local', '$allCueNames'],
    //   (cue, allCueNames) => cue && (cue.name || '').length > 0 && !_.includes(allCueNames, cue.name)
    // ],
    // '$nextCueIndex': [
    //   ['local', '$liveCueIndex'],
    //   liveCueIndex => liveCueIndex === -1 ? -1 : liveCueIndex + 1
    // ],
    // '$nextCue': [
    //   ['local', '$nextCueIndex'],
    //   ['synced', 'cues'],
    //   (nextCueIndex, cues = []) => cues[nextCueIndex] || null
    // ],
    // '$hasNextCue': [
    //   ['local', '$nextCueIndex'],
    //   ['synced', 'cues'],
    //   (nextCueIndex, cues) => {
    //     if (nextCueIndex === -1) {
    //       return false
    //     }
    //     var lastIndex = cues.length - 1
    //     return nextCueIndex <= lastIndex
    //   }
    // ],
    // '$nextCueUuid': [
    //   ['local', '$nextCueIndex'],
    //   ['synced', 'cues'],
    //   (nextCueIndex, cues = []) => (cues[nextCueIndex] || {}).uuid
    // ],
  }
}
