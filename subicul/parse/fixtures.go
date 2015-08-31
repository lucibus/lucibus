package parse

// InitialBytes is the json the server sends to the client when it first
// starts up
var InitialBytes = []byte(`
{
	"cues": [],
	"patch": {},
	"live": {
		"level": 1,
		"cue": "",
		"systems": []
	}
}`)

var OneSystemStateBytes = []byte(`
	{
		"patch": {},
		"cues": [],
		"live": {
			"level": 1,
			"cue": "",
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
		"cues": [],
		"live": {
			"level": 1,
			"cue": "",
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
		"cues": [],
		"live": {
			"level": 1,
			"cue": "",
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
