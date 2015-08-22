import Ajv from 'ajv'
import schema from '../../api/schema.json'

var ajv = Ajv()

export default ajv.compile(schema)
