package main

import (
	"fmt"
	"runtime"
	"time"

	lige "github.com/lucibus/lige/output"
)

func main() {
	runtime.GOMAXPROCS(runtime.NumCPU())
	od := lige.ENTTECUSBProOutputDevice{
		COMPort: "/dev/tty.usbserial-EN158833",
	}

	cf, err := CreateServer(9001, &od)
	select {}
	fmt.Println(err)
	cf()
	fmt.Println("done closing")
	time.Sleep(time.Millisecond)
	cf, err = CreateServer(9001, &od)
	fmt.Println(err)
	cf()
}
