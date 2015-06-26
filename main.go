package main

import (
	"fmt"
	"runtime"
)

func main() {
	runtime.GOMAXPROCS(runtime.NumCPU())
	cf, err := CreateServer(9001)
	fmt.Println(err)
	_ = "breakpoint"
	cf()
	cf, err = CreateServer(9001)
	fmt.Println(err)
	cf()
	_ = "breakpoi"
}
