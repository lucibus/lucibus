package parse

import (
	"testing"

	. "github.com/smartystreets/goconvey/convey"
)

func TestCues(t *testing.T) {
	Convey("Find should", t, func() {
		Convey("return a cue when one exists", func() {
			cFirst := Cue{Name: "hi", UUID: "first", Systems: Systems{}}
			cSecond := Cue{Name: "there", UUID: "second", Systems: Systems{}}
			cs := Cues{cFirst, cSecond}
			So(cs.Find("first").Name, ShouldEqual, "hi")
			So(cs.Find("second").Name, ShouldEqual, "there")
		})
		Convey("return nil when one doesnt", func() {
			c := Cue{Name: "hi", UUID: "first", Systems: Systems{}}
			cs := Cues{c}
			So(cs.Find("other"), ShouldBeNil)
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
