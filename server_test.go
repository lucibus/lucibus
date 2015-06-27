package main

import (
	"fmt"
	"net/http"
	"testing"
	"time"

	"github.com/gorilla/websocket"
	lige "github.com/lucibus/lige/output"

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
	So(p, ShouldResemble, message)
}

type testOutputDevice struct {
	output lige.State
}

func (od *testOutputDevice) Set(s lige.State) error {
	od.output = s
	return nil
}

func TestServer(t *testing.T) {
	Convey("when i start the server", t, func() {
		port := 9001
		od := testOutputDevice{}
		cancelF, err := CreateServer(port, &od)
		So(err, ShouldBeNil)
		url := fmt.Sprintf("ws://localhost:%v/", port)
		d := websocket.Dialer{}
		Convey("and connect", func() {
			conn, _, err := d.Dial(url, http.Header{})
			So(err, ShouldBeNil)
			Convey("it should return a default state", func() {
				shouldGet(conn, []byte(`{}`))

				Convey("it should take an updated state", func() {
					newState := []byte(`
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
	                    }
					`)
					shouldSend(conn, newState)

					Convey("and it should output the new state", func() {
						time.Sleep(time.Second / 2)
						So(od.output, ShouldResemble, lige.State{1: 255})
					})

					Convey("and reconnect", func() {
						conn.Close()
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
								secondNewState := []byte(`{"test2": "hi"}`)
								shouldSend(conn, secondNewState)
								shouldGet(conn2, secondNewState)
								Convey("and vice versa", func() {
									thirdNewState := []byte(`{"test3": "hi"}`)
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
				So(od.output, ShouldResemble, lige.State{})
			})
			Reset(func() {
				So(conn.Close(), ShouldBeNil)
			})

		})

		Reset(func() {
			cancelF()
			Println("killing server")

			time.Sleep(time.Millisecond)
		})

	})

}
