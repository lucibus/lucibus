var tv4 = require('tv4')
var schema = require('./schema.json')
var fs = require('fs')

var valid = tv4.validate(JSON.parse(fs.readFileSync('/dev/stdin').toString()), schema)

if (valid) {
  console.log('Valid.')
} else {
  console.log(tv4.error)
  throw new Error('Not valid.')
}
