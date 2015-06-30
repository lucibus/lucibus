package parse

import (
	"encoding/json"
	"testing"

	. "github.com/smartystreets/goconvey/convey"
)

func TestParse(t *testing.T) {

	Convey("it should parse correctly when we have valid json with", t, func() {
		Convey("no current systems", func() {
			b := []byte(`{"live": {"systems": []}}`)
			o, e := ParseAndOutput(b)
			So(e, ShouldBeNil)
			So(o, ShouldResemble, Output{})
		})

		Convey("a filter", func() {

			Convey("with an address", func() {
				b := []byte(`
                    {
                        "live": {
                            "level": 1,
                            "systems": [{
                                "type": "filter",
                                "level": 1,
                                "specifiers": {
                                    "address": 1
                                }
                            }]
                        }
                    }`)
				o, e := ParseAndOutput(b)
				So(e, ShouldBeNil)
				So(o, ShouldResemble, Output{1: 255})
			})

			Convey("with tags", func() {
				b := []byte(`
                    {
                        "patch": [
                            {
                                "tags": ["front"],
                                "address": 1
                            },
                            {
                                "tags": ["front"],
                                "address": 2
                            },
                            {
                                "tags": [],
                                "address": 3
                            }
                        ],
                        "live": {
                            "level": 1,
                            "systems": [{
                                "type": "filter",
                                "level": 1,
                                "specifiers": {
                                    "tags": ["front"]
                                }
                            }]
                        }
                    }`)
				o, e := ParseAndOutput(b)
				So(e, ShouldBeNil)
				So(o, ShouldResemble, Output{1: 255, 2: 255})
			})

			Convey("with a fixture type", func() {
				b := []byte(`
                    {
                        "patch": [
                            {
                                "fixtureType": "magic crap",
                                "tags": [],
                                "address": 1
                            },
                            {
                                "fixtureType": "magic crap",
                                "tags": [],
                                "address": 2
                            },
                            {
                                "fixtureType": "not magic crap",
                                "tags": [],
                                "address": 3
                            }
                        ],
                        "live": {
                            "level": 1,
                            "systems": [{
                                "type": "filter",
                                "level": 1,
                                "specifiers": {
                                    "fixtureType": "magic crap"
                                }
                            }]
                        }
                    }`)
				o, e := ParseAndOutput(b)
				So(e, ShouldBeNil)
				So(o, ShouldResemble, Output{1: 255, 2: 255})
			})

			Convey("a different level", func() {
				b := []byte(`
                    {
                        "patch": [],
                        "live": {
                            "level": 1,
                            "systems": [{
                                "type": "filter",
                                "level": 0.2,
                                "specifiers": {
                                    "address": 1
                                }
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
                    "patch": [],
                    "live": {
                        "level": 0.2,
                        "systems": [{
                            "type": "filter",
                            "level": 1,
                            "specifiers": {
                                "address": 1
                            }
                        }]
                    }
                }`)
			o, e := ParseAndOutput(b)
			So(e, ShouldBeNil)
			So(o, ShouldResemble, Output{1: 51})
		})

		Convey("two filters", func() {

			Convey("combine", func() {
				b := []byte(`
                    {
                        "patch": [],
                        "live": {
                            "level": 1,
                            "systems": [{
                                "type": "filter",
                                "level": 1,
                                "specifiers": {
                                    "address": 1
                                }
                            }, {
                                "type": "filter",
                                "level": 1,
                                "specifiers": {
                                    "address": 2
                                }
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
                        "patch": [],
                        "live": {
                            "level": 100,
                            "systems": [{
                                "type": "filter",
                                "level": 100,
                                "specifiers": {
                                    "address": 1
                                }
                            }, {
                                "type": "filter",
                                "level": 10,
                                "specifiers": {
                                    "address": 1
                                }
                            }]
                        }
                    }`)
				o, e := ParseAndOutput(b)
				So(e, ShouldBeNil)
				So(o, ShouldResemble, Output{1: 255})
			})

		})

		Convey("a cue", func() {
			b := []byte(`
                {
                    "patch": [],
                    "live": {
                        "level": 100,
                        "systems": [],
                        "cue": {
                            "id": 1,
                            "level": 255
                        }
                    },
                    "cues": {
                        "1": {
                            "systems": [{
                                "type": "filter",
                                "level": 100,
                                "specifiers": {
                                    "address": 1
                                }
                            }]
                        }
                    }
                }`)
			o, e := ParseAndOutput(b)
			So(e, ShouldBeNil)
			So(o, ShouldResemble, Output{1: 255})
		})

		Convey("a look", func() {
			b := []byte(`
				{
					"patch": [],
					"live": {
						"level": 1,
						"systems": [{
							"type": "look",
							"id": 1,
							"level": 1
						}]
					},
					"looks": {
						"1": {
							"systems": [{
								"type": "filter",
								"level": 1,
								"specifiers": {
									"address": 1
								}
							}]
						}
					}
				}`)
			o, e := ParseAndOutput(b)
			So(e, ShouldBeNil)
			So(o, ShouldResemble, Output{1: 255})
		})

	})
}

var oneSystemStateBytes = []byte(`
	{
		"live": {
			"level": 1,
			"systems": [{
				"type": "filter",
				"level": 1,
				"specifiers": {
					"address": 1
				}
			}]
		}
	}`)

func BenchmarkParse(b *testing.B) {
	for i := 0; i < b.N; i++ {
		Parse(oneSystemStateBytes)
	}
}

func BenchmarkUnmarshal(b *testing.B) {
	var s State
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		json.Unmarshal(oneSystemStateBytes, &s)
	}
}
