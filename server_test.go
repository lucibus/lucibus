package main

import (
	"fmt"
	"net/http"
	"testing"
	"time"

	"github.com/gorilla/websocket"

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

func TestServer(t *testing.T) {
	Convey("when i start the server", t, func() {
		port := 9001
		s := CreateServer(port)

		err := s.Serve()
		So(err, ShouldBeNil)
		url := fmt.Sprintf("ws://localhost:%v/", port)
		d := websocket.Dialer{}
		Convey("and connect", func() {
			conn, _, err := d.Dial(url, http.Header{})
			So(err, ShouldBeNil)
			Convey("it should return a default state", func() {
				shouldGet(conn, []byte(`{}`))

				Convey("it should take an updated state", func() {
					newState := []byte(`{"test": "hi"}`)
					shouldSend(conn, newState)

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

			Reset(func() {
				So(conn.Close(), ShouldBeNil)
			})

		})

		Reset(func() {
			So(s.Stop(), ShouldBeNil)
			time.Sleep(time.Nanosecond)
		})

	})

}
