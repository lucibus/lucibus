package output

import (
	"fmt"
	"time"
)

type DummyOutputDevice struct{}

func (do *DummyOutputDevice) Set(state State) (err error) {
	fmt.Printf("%v\n", state)
	time.Sleep(time.Second)
	return
}
