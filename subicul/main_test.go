package main

import (
	"fmt"
	"log"
	"net/http"
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

func TestServer(t *testing.T) {
	Convey("when i start the server", t, func() {
		port := 9001
		a := dmx.NewDebugAdaptor()
		ctx, cancelF := context.WithCancel(context.Background())
		err := MakeStateServer(ctx, port, a)
		So(err, ShouldBeNil)
		url := fmt.Sprintf("ws://localhost:%v/", port)
		d := websocket.Dialer{}
		Convey("and connect", func() {
			conn, _, err := d.Dial(url, http.Header{})
			So(err, ShouldBeNil)
			Convey("it should return a default state", func() {
				shouldGet(conn, parse.InitialBytes)

				Convey("it should take an updated state", func() {
					newState := parse.OneSystemStateBytes
					shouldSend(conn, newState)

					Convey("and it should output the new state", func() {
						time.Sleep(time.Second / 2)
						So(a.GetLastOutput(), ShouldResemble, map[int]byte{1: 255})
					})

					Convey("and reconnect", func() {
						shouldCloseConnection(conn)
						conn, _, err = d.Dial(url, http.Header{})
						So(err, ShouldBeNil)

						Convey("it should return the same state", func() {
							shouldGet(conn, newState)
						})
					})
					Convey("and connect with another client", func() {
						conn2, _, err := d.Dial(url, http.Header{})
						So(err, ShouldBeNil)
						Convey("it should initally recieve the state set by the first", func() {
							shouldGet(conn2, newState)
							Convey("and then when the first changes the state, it should get it", func() {
								secondNewState := parse.TwoSystemStateBytes
								shouldSend(conn, secondNewState)
								shouldGet(conn2, secondNewState)
								Convey("and vice versa", func() {
									thirdNewState := parse.ThreeSystemStateBytes
									shouldSend(conn2, thirdNewState)
									shouldGet(conn, thirdNewState)
								})

							})
							conn.WriteMessage(websocket.TextMessage, newState)
						})
						Reset(func() {
							So(conn2.Close(), ShouldBeNil)
						})
					})
				})
			})

			Convey("output should be blank", func() {
				So(a.GetLastOutput(), ShouldResemble, map[int]byte{})
			})
			Reset(func() {
				shouldCloseConnection(conn)
			})

		})

		Reset(func() {
			cancelF()
			time.Sleep(time.Millisecond)
			So("subicul", testutils.ShouldNotBeRunningGoroutines)
		})

	})

}

func BenchmarkServer(b *testing.B) {
	//	runtime.GOMAXPROCS(runtime.NumCPU())
	port := 9001
	a := dmx.NewDebugAdaptor()
	ctx, cancelF := context.WithCancel(context.Background())
	err := MakeStateServer(ctx, port, a)
	if err != nil {
		log.Panicln("error in create server", err)
	}
	url := fmt.Sprintf("ws://localhost:%v/", port)
	d := websocket.Dialer{}
	conn, _, err := d.Dial(url, http.Header{})
	if err != nil {
		log.Panicln("error in dial", err)
	}
	conn.ReadMessage()

	toggleSendOneDimmer := true
	var message []byte
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		b.StopTimer()
		prevLength := len(a.GetLastOutput())
		if toggleSendOneDimmer {
			message = parse.OneSystemStateBytes
		} else {
			message = parse.InitialBytes
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
	shouldCloseConnection(conn)
	cancelF()
	time.Sleep(time.Nanosecond)
}
