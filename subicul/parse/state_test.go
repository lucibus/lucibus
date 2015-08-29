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
			b := []byte(`
                    {
												"patch": {},
												"cues": [],
												"cues": [],
                        "live": {
                            "level": 1,
														"cue": null,
                            "systems": [{
                                "level": 1,
                                "query": [{"address": 1}],
																"uuid": "first"
                            }]
                        }
                    }`)
			o, e := ParseAndOutput(b)
			So(e, ShouldBeNil)
			So(o, ShouldResemble, Output{1: 255})

			Convey("two addresses", func() {
				b := []byte(`
                    {
											"patch": {},
											"cues": [],
                      "live": {
                          "level": 1,
													"cue": null,
                          "systems": [{
                              "level": 1,
															"query": [{"address": 2}],
															"uuid": "first"
                          }, {
                              "level": 1,
															"query": [{"address": 1}],
															"uuid": "second"
                          }]
                      }
                    }`)
				o, e := ParseAndOutput(b)
				So(e, ShouldBeNil)
				So(o, ShouldResemble, Output{1: 255, 2: 255})
			})
		})

		Convey("a tag", func() {
			b := []byte(`
                    {
												"patch": {"1": ["hi"]},
												"cues": [],
                        "live": {
                            "level": 1,
														"cue": null,
                            "systems": [{
                                "level": 1,
                                "query": [{"tag": "hi"}],
																"uuid": "first"
                            }]
                        }
                    }`)
			o, e := ParseAndOutput(b)
			So(e, ShouldBeNil)
			So(o, ShouldResemble, Output{1: 255})

			Convey("two tags", func() {
				b := []byte(`
                    {
											"patch": {"1": ["hi", "there"], "2": ["hi"]},
											"cues": [],
                      "live": {
                          "level": 1,
													"cue": null,
                          "systems": [{
                              "level": 1,
															"query": [{"tag": "hi"}, {"tag": "there"}],
															"uuid": "first"
                          }, {
                              "level": 0.2,
															"query": [{"tag": "hi"}],
															"uuid": "second"
                          }]
                      }
                    }`)
				o, e := ParseAndOutput(b)
				So(e, ShouldBeNil)
				So(o, ShouldResemble, Output{1: 255, 2: 51})
			})
		})
		Convey("a cue", func() {
			b := []byte(`
                  {
											"patch": {},
											"cues": [{
												"name": "hi",
												"uuid": "first",
												"systems": [{"level": 1, "query": [{"address": 1}], "uuid": "other"}]
											}],
                      "live": {
                          "level": 1,
													"cue": "first",
                          "systems": []
                      }
                  }`)
			o, e := ParseAndOutput(b)
			So(e, ShouldBeNil)
			So(o, ShouldResemble, Output{1: 255})

			Convey("a cue should be overriden by systems", func() {
				b := []byte(`
                    {
											"patch": {},
											"cues": [{
												"name": "hi",
												"uuid": "first",
												"systems": [{"level": 1, "query": [{"address": 1}], "uuid": "other"}]
											}],
                      "live": {
                          "level": 1,
													"cue": "first",
                          "systems": [{
                              "level": 0.2,
															"query": [{"address": 1}],
															"uuid": "otherf"
                          }]
                      }
                    }`)
				o, e := ParseAndOutput(b)
				So(e, ShouldBeNil)
				So(o, ShouldResemble, Output{1: 51})
			})
		})

		Convey("a different grandmaster level", func() {
			b := []byte(`
                	{
										"patch": {},
										"cues": [],
                    "live": {
                        "level": 0.2,
												"cue": null,
                        "systems": [{
                            "level": 1,
														"query": [{"address": 1}],
														"uuid": "first"
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
												"patch": {},
												"cues": [],
												"live": {
														"level": 1,
														"cue": null,
														"systems": [{
																"level": 1,
																"query": [{"address": 2}],
																"uuid": "first"
														}, {
																"level": 1,
																"query": [{"address": 1}],
																"uuid": "second"
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
												"patch": {},
												"cues": [],
												"live": {
														"level": 1,
														"cue": null,
														"systems": [{
																"level": 1,
																"query": [{"address": 1}],
																"uuid": "first"
														}, {
																"level": 0,
																"query": [{"address": 1}],
																"uuid": "second"
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
