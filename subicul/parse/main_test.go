package parse

import (
	"encoding/json"
	"testing"

	. "github.com/smartystreets/goconvey/convey"
)

func TestParse(t *testing.T) {

	Convey("it should parse correctly when we have valid json with", t, func() {
		Convey("no current systems", func() {
			s, e := MakeState()
			So(e, ShouldBeNil)
			o, e := s.Output()
			So(e, ShouldBeNil)
			So(o, ShouldResemble, Output{})
		})

		Convey("an address", func() {
			b := []byte(`
                    {
                        "live": {
                            "level": 1,
                            "systems": [{
                                "level": 1,
                                "address": 1
                            }]
                        }
                    }`)
			o, e := ParseAndOutput(b)
			So(e, ShouldBeNil)
			So(o, ShouldResemble, Output{1: 255})

			Convey("two addresses", func() {
				b := []byte(`
                    {
                      "live": {
                          "level": 1,
                          "systems": [{
                              "level": 1,
                              "address": 2
                          }, {
                              "level": 1,
                              "address": 1
                          }]
                      }
                    }`)
				o, e := ParseAndOutput(b)
				So(e, ShouldBeNil)
				So(o, ShouldResemble, Output{1: 255, 2: 255})
			})

		})

		Convey("a different grandmaster level", func() {
			b := []byte(`
                	{
                    "live": {
                        "level": 0.2,
                        "systems": [{
                            "level": 1,
														"address": 1
                        }]
                    }
                	}`)
			o, e := ParseAndOutput(b)
			So(e, ShouldBeNil)
			So(o, ShouldResemble, Output{1: 51})
		})

		Convey("two addresses", func() {

			Convey("combine", func() {
				b := []byte(`
										{
												"live": {
														"level": 1,
														"systems": [{
																"level": 1,
																"address": 2
														}, {
																"level": 1,
																"address": 1
														}]
												}
										}`)
				o, e := ParseAndOutput(b)
				So(e, ShouldBeNil)
				So(o, ShouldResemble, Output{1: 255, 2: 255})
			})

			Convey("override", func() {
				b := []byte(`
										{
												"live": {
														"level": 1,
														"systems": [{
																"level": 1,
																"address": 1
														}, {
																"level": 0,
																"address": 1
														}]
												}
										}`)
				o, e := ParseAndOutput(b)
				So(e, ShouldBeNil)
				So(o, ShouldResemble, Output{1: 255})
			})

		})
	})

}

func BenchmarkParse(b *testing.B) {
	for i := 0; i < b.N; i++ {
		Parse(OneSystemStateBytes)
	}
}

func BenchmarkUnmarshal(b *testing.B) {
	var s State
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		json.Unmarshal(OneSystemStateBytes, &s)
	}
}
