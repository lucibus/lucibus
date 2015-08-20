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
				"address": 1
			}]
		}
	}`)

var TwoSystemStateBytes = []byte(`
	{
		"live": {
			"level": 1,
			"systems": [{
				"level": 1,
				"address": 1
			}, {
				"level": 1,
				"address": 2
			}]
		}
	}`)
var ThreeSystemStateBytes = []byte(`
	{
		"live": {
			"level": 1,
			"systems": [{
				"level": 1,
				"address": 1
			}, {
				"level": 1,
				"address": 2
			}, {
				"level": 1,
				"address": 3
			}]
		}
	}`)
