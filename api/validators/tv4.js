var tv4 = require('tv4')
var schema = require('./schema.json')
var sample = require('./sample.json')

var valid = tv4.validate(sample, schema)

if (valid) {
  console.log('Valid.')
} else {
  console.log(tv4.error)
  throw new Error('Not valid.')
}
