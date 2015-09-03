package parse

import (
	"encoding/json"
	"testing"

	. "github.com/smartystreets/goconvey/convey"
)

func TestState(t *testing.T) {

	Convey("it should parse correctly when we have valid json with", t, func() {
		fs, err := GetFixtures()
		So(err, ShouldBeNil)
		for _, f := range fs {
			Convey(f.Name, func() {
				o, e := ParseAndOutput(f.State)
				So(e, ShouldBeNil)
				So(o, ShouldResemble, *f.Output)
			})
		}
	})
}

func BenchmarkParse(b *testing.B) {
	by, err := ValidState("sample")
	if err != nil {
		b.Error(err)
	}
	b.ReportAllocs()
	for i := 0; i < b.N; i++ {
		Parse(by)
	}
}

func BenchmarkUnmarshal(b *testing.B) {
	var s State
	by, err := ValidState("sample")
	if err != nil {
		b.Error(err)
	}
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		json.Unmarshal(by, &s)
	}
}
