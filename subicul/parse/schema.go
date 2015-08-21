package parse

import "github.com/xeipuuv/gojsonschema"

var schema gojsonschema.JSONLoader

func getSchema() (gojsonschema.JSONLoader, error) {
	if schema != nil {
		return schema, nil
	}
	b, err := Asset("schema.json")
	if err != nil {
		return nil, err
	}
	return gojsonschema.NewStringLoader(string(b)), nil
}
