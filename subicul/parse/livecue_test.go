package parse

import (
	"testing"
	"time"

	. "github.com/smartystreets/goconvey/convey"
)

func TestLiveCue(t *testing.T) {
	Convey("Ouput should", t, func() {
		st, err := MakeState()
		So(err, ShouldBeNil)
		cFirst := Cue{
			Name: "hi",
			UUID: "first",
			Systems: Systems{{
				Level: 1,
				Query: []QueryItem{{Address: 1}},
			}}}
		cSecond := Cue{
			Name:     "hi2",
			UUID:     "second",
			Duration: 5,
			Systems: Systems{{
				Level: 0,
				Query: []QueryItem{{Address: 1}},
			}}}
		st.Cues = Cues{cFirst, cSecond}
		lc := LiveCue{
			UUID: "second",
		}

		Convey("return just the prev cue, when percent 0", func() {
			lc.Percent = 0
			output, err := lc.Output(st, time.Now())
			So(err, ShouldBeNil)
			So(output, ShouldResemble, Output{1: 255})
		})
		Convey("return just the prev cue, when the it has just started", func() {
			startTime := time.Now()
			lc.Time = TimeMarshall(startTime)
			output, err := lc.Output(st, startTime)
			So(err, ShouldBeNil)
			So(output, ShouldResemble, Output{1: 255})
		})
		Convey("return just the cur cue, when percent is 1", func() {
			lc.Percent = 1
			output, err := lc.Output(st, time.Now())
			So(err, ShouldBeNil)
			So(output, ShouldResemble, Output{1: 0})
		})
		Convey("return just the cur cue, when it has just finished", func() {
			startTime := time.Now()
			currentTime := startTime.Add(time.Millisecond * 5)
			lc.Time = TimeMarshall(startTime)

			output, err := lc.Output(st, currentTime)
			So(err, ShouldBeNil)
			So(output, ShouldResemble, Output{1: 0})
		})
		Convey("return just the cur cue, when it has finished", func() {
			startTime := time.Now()
			currentTime := startTime.Add(time.Millisecond * 6)
			lc.Time = TimeMarshall(startTime)

			output, err := lc.Output(st, currentTime)
			So(err, ShouldBeNil)
			So(output, ShouldResemble, Output{1: 0})
		})
		Convey("be in between, with 0<percent<1 ", func() {
			lc.Percent = 0.2

			output, err := lc.Output(st, time.Now())
			So(err, ShouldBeNil)
			So(output, ShouldResemble, Output{1: 204})
		})
		Convey("be in between, when it hasn't been too long since it started", func() {
			startTime := time.Now()
			currentTime := startTime.Add(time.Millisecond)
			lc.Time = TimeMarshall(startTime)

			output, err := lc.Output(st, currentTime)
			So(err, ShouldBeNil)
			So(output, ShouldResemble, Output{1: 204})
		})
		Convey("fade from blank to the first cue", func() {
			lc.Percent = 0.2
			lc.UUID = "first"
			output, err := lc.Output(st, time.Now())
			So(err, ShouldBeNil)
			So(output, ShouldResemble, Output{1: 51})
		})
	})
}
