package subicul

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"golang.org/x/net/context"

	"github.com/gorilla/websocket"
	"github.com/lucibus/dmx"
	"github.com/lucibus/lucibus/subicul/parse"
	"github.com/lucibus/lucibus/subicul/testutils"

	. "github.com/smartystreets/goconvey/convey"
)

func shouldSend(conn *websocket.Conn, message []byte) {
	err := conn.WriteMessage(websocket.TextMessage, message)
	So(err, ShouldBeNil)
}

func shouldGet(conn *websocket.Conn, message []byte) {
	messageType, p, err := conn.ReadMessage()
	So(err, ShouldBeNil)
	So(messageType, ShouldEqual, websocket.TextMessage)
	So(p, testutils.ShouldMatchJSON, message)
}

func shouldCloseConnection(actual interface{}, _ ...interface{}) string {
	conn := actual.(*websocket.Conn)
	err := conn.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, ""))
	if err != nil {
		return "Websocket connection didn't close properly: " + err.Error()
	}
	return ""
}

func testServer() *httptest.Server {
	return httptest.NewServer(http.HandlerFunc(HandleFunc()))
}

func setupTestServer() (*dmx.DebugAdaptor, string, func()) {
	ctx, cancel := context.WithCancel(context.WithValue(context.Background(), "IsDone", make(chan interface{})))

	a := dmx.NewDebugAdaptor()
	go Output(ctx, a)
	ts := testServer()
	stopServer := func() {
		cancel()
		ts.CloseClientConnections()
		ts.Close()
		<-ctx.Value("IsDone").(chan interface{})
	}
	url := strings.Replace(ts.URL, "http", "ws", 1)
	return a, url, stopServer
}

func OutputFromMap(m map[int]uint8) parse.Output {
	o := parse.Output{}
	for address, levelInt := range m {
		o[address] = byte(levelInt)
	}
	return o
}

func TestServer(t *testing.T) {
	ResetState()
	a, url, stopServer := setupTestServer()
	defer stopServer()

	// log.SetLevel(log.WarnLevel)

	Convey("when i start the server", t, func() {
		So(ResetState(), ShouldBeNil)
		d := websocket.Dialer{}
		Convey("and connect", func() {
			conn, _, err := d.Dial(url, http.Header{})
			So(err, ShouldBeNil)
			Convey("it should return a default state", func() {
				f, err := parse.GetFixture("initial")
				So(err, ShouldBeNil)
				shouldGet(conn, f.State)

				Convey("it shouldnt crash on an invalid state", func() {
					shouldSend(conn, []byte{})
					Convey("and should still take messages", func() {
						f, err := parse.GetFixture("address-one")
						So(err, ShouldBeNil)
						shouldSend(conn, f.State)
						time.Sleep(time.Millisecond * 50)
						So(OutputFromMap(a.GetLastOutput()), ShouldResemble, *f.Output)
					})
				})

				Convey("it should update a new time.now() cue", func() {
					s, err := parse.ValidState("cue-time-now")
					So(err, ShouldBeNil)
					shouldSend(conn, s)
					time.Sleep(time.Millisecond * 100)
					So(OutputFromMap(a.GetLastOutput()), ShouldResemble, parse.Output{1: 255})
					Convey("and return the updates state", func() {
						messageType, p, err := conn.ReadMessage()
						So(err, ShouldBeNil)
						So(messageType, ShouldEqual, websocket.TextMessage)
						So(p, testutils.ShouldNotMatchJSON, s)
					})
				})

				Convey("it should take an updated state", func() {
					f, err := parse.GetFixture("address-one")
					So(err, ShouldBeNil)
					shouldSend(conn, f.State)
					Convey("and it should output the new state", func() {
						time.Sleep(time.Millisecond * 50)
						So(OutputFromMap(a.GetLastOutput()), ShouldResemble, *f.Output)
					})

					Convey("and reconnect", func() {
						shouldCloseConnection(conn)
						time.Sleep(time.Millisecond * 50)
						conn, _, err = d.Dial(url, http.Header{})
						So(err, ShouldBeNil)

						Convey("it should return the same state", func() {
							shouldGet(conn, f.State)
						})
					})
					Convey("and connect with another client", func() {
						time.Sleep(time.Millisecond * 50)
						conn2, _, err := d.Dial(url, http.Header{})
						So(err, ShouldBeNil)
						Convey("it should initially recieve the state set by the first", func() {
							shouldGet(conn2, f.State)
							Convey("and then when the first changes the state, it should get it", func() {
								s2, err := parse.ValidState("address-two")
								So(err, ShouldBeNil)
								shouldSend(conn, s2)
								shouldGet(conn2, s2)
								Convey("and vice versa", func() {
									s3, err := parse.ValidState("address-two-reversed")
									So(err, ShouldBeNil)
									shouldSend(conn2, s3)
									shouldGet(conn, s3)
								})
							})
						})
					})
				})
			})

			Convey("output should be for initial", func() {
				So(ResetState(), ShouldBeNil)
				time.Sleep(time.Millisecond * 200)
				f, err := parse.GetFixture("initial")
				So(err, ShouldBeNil)
				So(OutputFromMap(a.GetLastOutput()), ShouldResemble, *f.Output)
			})
		})
		Reset(func() {
			// So(ResetState(), ShouldBeNil)
			//So("subicul", testutils.ShouldNotBeRunningGoroutines)
		})
	})
}

func BenchmarkServer(b *testing.B) {
	a, url, stopServer := setupTestServer()
	d := websocket.Dialer{}
	conn, _, err := d.Dial(url, http.Header{})
	if err != nil {
		b.Error(err)
	}
	conn.ReadMessage()

	toggleSendOneDimmer := true
	var init, sample, message []byte
	init, err = parse.ValidState("initial")
	if err != nil {
		b.Error(err)
	}
	sample, err = parse.ValidState("sample")
	if err != nil {
		b.Error(err)
	}
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		b.StopTimer()
		prevLength := len(a.GetLastOutput())
		if toggleSendOneDimmer {
			message = init
		} else {
			message = sample
		}
		toggleSendOneDimmer = !toggleSendOneDimmer
		b.StartTimer()
		conn.WriteMessage(websocket.TextMessage, message)
		for {
			time.Sleep(time.Nanosecond)
			if len(a.GetLastOutput()) != prevLength {
				break
			}
		}
	}
	b.StopTimer()
	stopServer()
}
