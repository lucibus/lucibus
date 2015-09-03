package parse

import (
	"encoding/json"
	"testing"

	. "github.com/smartystreets/goconvey/convey"
)

func TestState(t *testing.T) {

	Convey("it should parse correctly when we have valid json with", t, func() {
		Convey("no current systems", func() {
			s, e := MakeState()
			So(e, ShouldBeNil)
			o, e := s.Output()
			So(e, ShouldBeNil)
			So(o, ShouldResemble, Output{})
		})

		Convey("an address", func() {
			b := Fixture("address-one")
			o, e := ParseAndOutput(b)
			So(e, ShouldBeNil)
			So(o, ShouldResemble, Output{1: 255})

			Convey("two addresses", func() {
				b := Fixture("address-two")
				o, e := ParseAndOutput(b)
				So(e, ShouldBeNil)
				So(o, ShouldResemble, Output{1: 255, 2: 255})
			})
		})

		Convey("a tag", func() {
			b := Fixture("tag-one")
			o, e := ParseAndOutput(b)
			So(e, ShouldBeNil)
			So(o, ShouldResemble, Output{1: 255})

			Convey("two tags", func() {
				b := Fixture("tag-two")
				o, e := ParseAndOutput(b)
				So(e, ShouldBeNil)
				So(o, ShouldResemble, Output{1: 255, 2: 51})
			})
		})
		Convey("a cue", func() {
			b := Fixture("cue")
			o, e := ParseAndOutput(b)
			So(e, ShouldBeNil)
			So(o, ShouldResemble, Output{1: 255})

			Convey("a cue should be overriden by systems", func() {
				b := Fixture("cue-overriden")
				o, e := ParseAndOutput(b)
				So(e, ShouldBeNil)
				So(o, ShouldResemble, Output{1: 51})
			})
		})

		Convey("a different grandmaster level", func() {
			b := Fixture("grandmaster")
			o, e := ParseAndOutput(b)
			So(e, ShouldBeNil)
			So(o, ShouldResemble, Output{1: 51})
		})

		Convey("two systems", func() {

			Convey("combine", func() {
				b := Fixture("system-combine")
				o, e := ParseAndOutput(b)
				So(e, ShouldBeNil)
				So(o, ShouldResemble, Output{1: 255, 2: 255})
			})

			Convey("override", func() {
				b := Fixture("system-override")
				o, e := ParseAndOutput(b)
				So(e, ShouldBeNil)
				So(o, ShouldResemble, Output{1: 255})
			})

		})
		Convey("sample", func() {
			o, e := ParseAndOutput(Fixture("sample"))
			So(e, ShouldBeNil)
			So(o, ShouldNotResemble, Output{})
		})
		Convey("sample-2", func() {
			o, e := ParseAndOutput(Fixture("sample-2"))
			So(e, ShouldBeNil)
			So(o, ShouldNotResemble, Output{})
		})
		Convey("sample-3", func() {
			o, e := ParseAndOutput(Fixture("sample-3"))
			So(e, ShouldBeNil)
			So(o, ShouldNotResemble, Output{})
		})
	})

}

func BenchmarkParse(b *testing.B) {
	by := Fixture("sample")
	b.ReportAllocs()
	for i := 0; i < b.N; i++ {
		Parse(by)
	}
}

func BenchmarkUnmarshal(b *testing.B) {
	var s State
	by := Fixture("sample")
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		json.Unmarshal(by, &s)
	}
}
