package main

import "runtime"

func main() {
	runtime.GOMAXPROCS(runtime.NumCPU())
	server := CreateServer(9001)
	server.Serve()
	_ = "breakpoint"
	server.Stop()
	server.Serve()
	_ = "breakpoint"
	_ = "hi"
}
