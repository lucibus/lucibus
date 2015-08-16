import React, {addons} from 'react/addons'
import $ from 'jquery'
import {assert} from 'chai'

import App from 'containers/App'
import Live from 'containers/Live'
import Grandmaster from 'containers/Grandmaster'
import System from 'components/System'
import Level from 'components/Level'

// from http://stackoverflow.com/a/16158932/907060
$.expr[':'].containsExact = (obj, index, meta, stack) => {
  return obj.innerHTML === meta[3]
}

const TestUtils = addons.TestUtils

function componentShouldExist (tree, type) {
  var elements = TestUtils.scryRenderedComponentsWithType(tree, type)
  console.log(elements)
  debugger

  test('should exist', () => {
    console.log('asserting')
    assert.equal(elements.length, 1)
  })
  return elements[0]
}

function elementShouldExist (parent, selector) {
  var elements = parent.find(selector)
  test('should exist', () => {
    assert.equal(elements.length, 1)
  })
  return elements[0]
}

function shouldEqual (text, one, two) {
  test(text, () => {
    assert.equal(one, two)
  })
}

// // _$ returns the jquery node from a react component
// function _$ (component) {
//   return $(component.GetDOMNode())
// }

function shouldContainNodeWithText (component, text) {
  test(`should contain "{text}"`, () => {
    console.log('second asserting')

    assert.equal(1, $(component).find(`:containsExact("{text}")`).length)
  })
}

suite('App', () => {
  var app = App({
    shouldMockWebSocket: true
  })
  React.render(app, document.getElementById('content'))

  suite('Live', () => {
    var live = componentShouldExist(app, Live)
    console.log(live)
    shouldContainNodeWithText(live, 'Live')

    suite('Grandmaster', () => {
      var grandmaster = componentShouldExist(live, Grandmaster)
      shouldContainNodeWithText(grandmaster, 'Grandmaster')

      suite('System', () => {
        var system = componentShouldExist(grandmaster, System)
        suite('Level', () => {
          var level = componentShouldExist(system, Level)
          console.log(level)
          suite('Input', () => {
            var input = elementShouldExist($(level), 'input')
            TestUtils.Simulate.change(input, {target: {value: 50}})
          })
        })
      })
    })
  })
})
