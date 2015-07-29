var Ajv = require('ajv')
var schema = require('./schema.json')
var sample = require('./sample.json')

var ajv = Ajv()

var validate = ajv.compile(schema)
var valid = validate(sample)

if (valid) {
  console.log('Valid.')
} else {
  console.log(validate.errors)
  throw new Error('Not valid.')
}
