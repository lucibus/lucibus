package parse

// InitialBytes is the json the server sends to the client when it first
// starts up
var InitialBytes = []byte(`
{
	"patch": {},
	"live": {
		"level": 1,
		"systems": []
	}
}`)

var OneSystemStateBytes = []byte(`
	{
		"patch": {},
		"live": {
			"level": 1,
			"systems": [{
				"level": 1,
				"query": [{"address": 1}],
				"uuid": "first"
			}]
		}
	}`)

var TwoSystemStateBytes = []byte(`
	{
		"patch": {},
		"live": {
			"level": 1,
			"systems": [{
				"level": 1,
				"query": [{"address": 1}],
				"uuid": "first"
			}, {
				"level": 1,
				"query": [{"address": 2}],
				"uuid": "second"
			}]
		}
	}`)
var ThreeSystemStateBytes = []byte(`
	{
		"patch": {},
		"live": {
			"level": 1,
			"systems": [{
				"level": 1,
				"query": [{"address": 1}],
				"uuid": "first"
			}, {
				"level": 1,
				"query": [{"address": 2}],
				"uuid": "second"
			}, {
				"level": 1,
				"query": [{"address": 3}],
				"uuid": "third"
			}]
		}
	}`)
