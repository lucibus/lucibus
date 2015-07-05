package main

import (
	"fmt"
	"net/http"
	"strconv"
	"testing"
	"time"

	"github.com/gorilla/websocket"
	"github.com/lucibus/subicul/testutils"
	"golang.org/x/net/context"

	. "github.com/smartystreets/goconvey/convey"
)

func TestMainCLI(t *testing.T) {
	Convey("when I run the app", t, func() {
		port := 9001

		ctx, cancelFunc := context.WithCancel(context.Background())

		app := makeCliApp(ctx)
		go app.Run([]string{"<executable path>", "--port", strconv.Itoa(port)})
		time.Sleep(time.Millisecond)

		url := fmt.Sprintf("ws://localhost:%v/", port)
		d := websocket.Dialer{}
		Convey("and connect", func() {
			conn, _, err := d.Dial(url, http.Header{})
			So(err, ShouldBeNil)
			conn.Close()
		})

		Reset(func() {
			cancelFunc()
			time.Sleep(5 * time.Millisecond)
			So("subicul", testutils.ShouldNotBeRunningGoroutines)
		})

	})

}
