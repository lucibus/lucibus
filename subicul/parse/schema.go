package parse

import (
	"fmt"

	"github.com/xeipuuv/gojsonschema"
)

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

// SchemaError is returned when a JSON schema does not match.
type SchemaError struct {
	Errors []gojsonschema.ResultError
}

func (se *SchemaError) Error() (s string) {
	for _, desc := range se.Errors {
		s += fmt.Sprintln(desc)
	}
	return
}
