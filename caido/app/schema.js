import Ajv from 'ajv'
import schema from '../../api/schema.json'

export default Ajv().compile(schema)
