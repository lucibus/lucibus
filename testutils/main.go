package testutils

import (
	"bufio"
	"bytes"
	"runtime/pprof"
	"strings"
)

// ShouldNotBeRunningGoroutines takes in the name of the current module as
// `actual` and returns a blank string if no other goroutines are running
// in that module, besides testing gorutines.
// If there are other goroutines running, it will output the full stacktrace.
// It does this by parsing the full stack trace of all currently running
// goroutines and seeing if any of them are within this module and are not
// testing goroutines.
func ShouldNotBeRunningGoroutines(actual interface{}, _ ...interface{}) string {
	// this function has to take an interface{} type so that you can use it with
	// GoConvey's `So(...)` function.
	module := actual.(string)

	var b bytes.Buffer
	// passes 1 as the debug parameter so there are function names and line numbers
	pprof.Lookup("goroutine").WriteTo(&b, 1)
	scanner := bufio.NewScanner(&b)
	// each line of this stack trace is one path in one goroutine that is running
	for scanner.Scan() {
		t := scanner.Text()
		// now we wanna check when this line we are looking at shows a goroutine
		// that is
		runningInModule := strings.Contains(t, module)
		runningTest := strings.Contains(t, "test")
		runningExternal := strings.Contains(t, "Godeps")
		runningOtherFileInModule := runningInModule && !runningTest && !runningExternal
		if runningOtherFileInModule {
			pprof.Lookup("goroutine").WriteTo(&b, 2)
			return "Was running other goroutines: " + t + b.String()
		}
	}
	return ""
}
