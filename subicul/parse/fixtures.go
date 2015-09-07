package parse

import (
	"path"
	"strings"
	"time"

	"github.com/lucibus/lucibus/subicul/parse/api"
)

func getValid(name string) ([]byte, error) {
	path := path.Join("valid", name)
	return api.Asset(path)
}

// ValidState returns a valid schema from `../api/valid`
func ValidState(name string) ([]byte, error) {
	return getValid(name + ".state.json")
}

// Fixture is a fixture imported from ../api/valid. It is used for testing.
type Fixture struct {
	State  []byte
	Output *Output
	Name   string
	Time   time.Time
}

// GetFixture return a fixture from ../api/vali
func GetFixture(name string) (f Fixture, err error) {
	f = Fixture{Name: name}
	f.State, err = ValidState(f.Name)
	if err != nil {
		return
	}

	var b []byte
	b, err = getValid(name + ".output.json")
	if err != nil {
		return f, err
	}
	f.Output, err = OutputFromJSON(b)

	b, err = getValid(name + ".time.json")
	if err == nil {
		t, err := TimeFromJSON(b)
		if err != nil {
			return f, err
		}
		tGo, err := t.Unmarshal()
		if err != nil {
			return f, err
		}
		f.Time = tGo
	}
	return f, nil
}

// GetFixtures returns all the fixture from ../api/valid
func GetFixtures() (fs []*Fixture, err error) {
	allValid, err := api.AssetDir("valid")
	if err != nil {
		return
	}
	fs = []*Fixture{}
	for _, fileName := range allValid {
		parts := strings.Split(fileName, ".")
		if parts[1] == "output" {
			f, err := GetFixture(parts[0])
			if err != nil {
				return fs, err
			}
			fs = append(fs, &f)
		}
	}
	return
}
