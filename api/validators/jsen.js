var jsen = require('jsen')
var schema = require('./schema.json')
var fs = require('fs')

var validate = jsen(schema)
var valid = validate(JSON.parse(fs.readFileSync('/dev/stdin').toString()))

if (valid) {
  console.log('Valid.')
} else {
  console.log(validate.errors)
  throw new Error('Not valid.')
}
