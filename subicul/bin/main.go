package main

import (
	"os"

	"github.com/lucibus/lucibus/subicul"
	"golang.org/x/net/context"
)

func main() {
	app := subicul.MakeCliApp(context.Background())
	app.Run(os.Args)
}
