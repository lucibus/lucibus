var Ajv = require('ajv')
var schema = require('./schema.json')
var fs = require('fs')

var ajv = Ajv()

var validate = ajv.compile(schema)
var valid = validate(JSON.parse(fs.readFileSync('/dev/stdin').toString()))

if (valid) {
  console.log('Valid.')
} else {
  console.log(validate.errors)
  throw new Error('Not valid.')
}
