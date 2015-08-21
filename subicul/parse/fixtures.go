package parse

// InitialBytes is the json the server sends to the client when it first
// starts up
var InitialBytes = []byte(`
{
	"live": {
		"level": 1,
		"systems": []
	}
}`)

var OneSystemStateBytes = []byte(`
	{
		"live": {
			"level": 1,
			"systems": [{
				"level": 1,
				"address": 1,
				"uuid": "first"
			}]
		}
	}`)

var TwoSystemStateBytes = []byte(`
	{
		"live": {
			"level": 1,
			"systems": [{
				"level": 1,
				"address": 1,
				"uuid": "first"
			}, {
				"level": 1,
				"address": 2,
				"uuid": "second"
			}]
		}
	}`)
var ThreeSystemStateBytes = []byte(`
	{
		"live": {
			"level": 1,
			"systems": [{
				"level": 1,
				"address": 1,
				"uuid": "first"
			}, {
				"level": 1,
				"address": 2,
				"uuid": "second"
			}, {
				"level": 1,
				"address": 3,
				"uuid": "third"
			}]
		}
	}`)
