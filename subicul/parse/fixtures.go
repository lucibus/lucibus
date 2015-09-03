package parse

import (
	"path"

	"github.com/lucibus/lucibus/subicul/parse/api"
)

// Fixture returns a valid schema from `../api/valid`
func Fixture(name string) []byte {
	path := path.Join("valid", name+".json")
	b, err := api.Asset(path)
	if err != nil {
		panic(err)
	}
	return b
}
