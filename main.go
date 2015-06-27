package main

import (
	"fmt"
	"runtime"

	lige "github.com/lucibus/lige/output"
)

func main() {
	runtime.GOMAXPROCS(runtime.NumCPU())
	od := lige.ENTTECUSBProOutputDevice{
		COMPort: "/dev/tty.usbserial-EN158833",
	}
	// od := lige.DummyOutputDevice{}

	_, err := CreateServer(9001, &od)
	fmt.Println(err)
	select {}
}
