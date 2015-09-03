package parse

import (
	"testing"

	. "github.com/smartystreets/goconvey/convey"
)

func TestCues(t *testing.T) {
	Convey("Find should", t, func() {
		Convey("return a cue and the prev one", func() {
			cFirst := Cue{Name: "hi", UUID: "first", Systems: Systems{}}
			cSecond := Cue{Name: "there", UUID: "second", Systems: Systems{}}
			cs := Cues{cFirst, cSecond}
			c, p := cs.Find("second")

			So(c.Name, ShouldEqual, "there")
			So(p.Name, ShouldEqual, "hi")
		})
		Convey("return no prev cue when there isnt one", func() {
			cFirst := Cue{Name: "hi", UUID: "first", Systems: Systems{}}
			cSecond := Cue{Name: "there", UUID: "second", Systems: Systems{}}
			cs := Cues{cFirst, cSecond}
			c, p := cs.Find("first")
			So(c.Name, ShouldEqual, "hi")
			So(p, ShouldBeNil)
		})
		Convey("return nil when one doesnt", func() {
			c := Cue{Name: "hi", UUID: "first", Systems: Systems{}}
			cs := Cues{c}
			cur, p := cs.Find("other")
			So(cur, ShouldBeNil)
			So(p, ShouldBeNil)
		})
	})
	Convey("Ouput should", t, func() {
		Convey("Be blank when there are no systems", func() {
			c := Cue{Name: "hi", UUID: "first", Systems: Systems{}}
			o, err := c.Output(&State{})
			So(err, ShouldBeNil)
			So(o, ShouldResemble, Output{})
		})
	})
}
