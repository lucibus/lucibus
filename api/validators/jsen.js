var jsen = require('jsen')
var schema = require('./schema.json')
var sample = require('./sample.json')

var validate = jsen(schema)
var valid = validate(sample)

if (valid) {
  console.log('Valid.')
} else {
  console.log(validate.errors)
  throw new Error('Not valid.')
}
