package parse

import (
	"os"
	"path/filepath"
	"runtime"

	"github.com/xeipuuv/gojsonschema"
)

var schema gojsonschema.JSONLoader

func getFilePath() string {
	_, filename, _, _ := runtime.Caller(1)
	return filepath.Join(filepath.Dir(filename), "../../api/schema.json")
}

func getSchema() gojsonschema.JSONLoader {
	if schema != nil {
		return schema
	}
	schemaFilePath := getFilePath()
	if _, err := os.Stat(schemaFilePath); err == nil {
		return gojsonschema.NewReferenceLoader("file://" + schemaFilePath)
	}
	return gojsonschema.NewReferenceLoader("http://localhost/api/schema.json")
}
