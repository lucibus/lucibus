package testutils

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"reflect"
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
		// that is running a file in this module that is not a test or a dep
		runningInModule := strings.Contains(t, module)
		runningTest := strings.Contains(t, "test")
		runningExternal := strings.Contains(t, "Godeps") || strings.Contains(t, "vendor")
		runningOtherFileInModule := runningInModule && !runningTest && !runningExternal
		if runningOtherFileInModule {
			// if we find that it is in fact running another goroutine from this
			// package then output the full stacktrace, with debug level 2 to show
			// more information
			pprof.Lookup("goroutine").WriteTo(&b, 2)
			return "Was running other goroutine: " + t + "\n" + "\n" + b.String()
		}
	}
	return ""
}

// ShouldMatchJSON checks if actual and expected[0] are strings that
// hold the same JSON representation
// logic copied from https://github.com/onsi/gomega/blob/d6c945f9fdbf6cad99e85b0feff591caa268e0db/matchers/match_json_matcher.go#L15-L29
func ShouldMatchJSON(actual interface{}, expected ...interface{}) string {
	actualBytes := actual.([]byte)
	expectedBytes := expected[0].([]byte)

	var aval interface{}
	var eval interface{}

	json.Unmarshal(actualBytes, &aval)
	json.Unmarshal(expectedBytes, &eval)

	if !reflect.DeepEqual(aval, eval) {
		return fmt.Sprintf("JSON %s supposed to = %s", actualBytes, expectedBytes)
	}
	return ""
}

// ShouldNotMatchJSON checks if actual and expected[0] are strings that
// hold different JSON representations
// logic copied from https://github.com/onsi/gomega/blob/d6c945f9fdbf6cad99e85b0feff591caa268e0db/matchers/match_json_matcher.go#L15-L29
func ShouldNotMatchJSON(actual interface{}, expected ...interface{}) string {
	matchError := ShouldMatchJSON(actual, expected[0])
	if matchError == "" {
		return fmt.Sprintf("JSON's matched: %s", actual)
	}
	return ""
}
