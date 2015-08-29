package parse

import (
	"testing"

	. "github.com/smartystreets/goconvey/convey"
)

func TestPatch(t *testing.T) {
	Convey("Filter should", t, func() {
		Convey("return no addresses when", func() {
			Convey("there are no patch items and we ask for a tag", func() {
				p := Patch{}
				q := Query{{Tag: "hi"}}
				So(p.Filter(q), ShouldBeEmpty)
			})
			Convey("we ask for a tag, but that tag doesnt exist", func() {
				p := Patch{"1": {"there"}}
				q := Query{{Tag: "hi"}}
				So(p.Filter(q), ShouldBeEmpty)
			})
			Convey("we ask for two different addresses", func() {
				p := Patch{}
				q := Query{{Address: 1}, {Address: 2}}
				So(p.Filter(q), ShouldBeEmpty)
			})
		})
		Convey("return one address when", func() {
			Convey("we ask for that address", func() {
				p := Patch{}
				q := Query{{Address: 1}}
				So(p.Filter(q), ShouldResemble, []Address{1})
			})
			Convey("we ask for a tag", func() {
				p := Patch{"1": {"one"}, "2": {"two"}}
				q := Query{{Tag: "two"}}
				So(p.Filter(q), ShouldResemble, []Address{2})
			})
			Convey("we ask two tags", func() {
				p := Patch{"1": {"one"}, "2": {"one", "two"}}
				q := Query{{Tag: "two"}, {Tag: "one"}}
				So(p.Filter(q), ShouldResemble, []Address{2})
			})
		})
		Convey("return two addresses when", func() {
			Convey("we ask for a tag", func() {
				p := Patch{"1": {"one"}, "2": {"one"}}
				q := Query{{Tag: "one"}}
				So(p.Filter(q), ShouldResemble, []Address{1, 2})
			})
		})
	})
}
