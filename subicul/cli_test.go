package subicul

import (
	"fmt"
	"net/http"
	"strconv"
	"testing"
	"time"

	log "github.com/Sirupsen/logrus"

	"github.com/gorilla/websocket"
	"golang.org/x/net/context"

	. "github.com/smartystreets/goconvey/convey"
)

func TestMainCLI(t *testing.T) {

	SkipConvey("when I run the app", t, func() {
		port := 9004
		ctx := context.Background()
		app := MakeCliApp(ctx)
		log.SetLevel(log.WarnLevel)
		go app.Run([]string{"<executable path>", "--port", strconv.Itoa(port)})
		time.Sleep(time.Millisecond)

		url := fmt.Sprintf("ws://localhost:%v/", port)
		d := websocket.Dialer{}
		Convey("and connect", func() {
			conn, _, err := d.Dial(url, http.Header{})
			So(err, ShouldBeNil)
			conn.Close()
		})
	})

}
