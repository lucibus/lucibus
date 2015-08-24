package main

import (
	"fmt"
	"net/http"
	"os"
	"strconv"

	"github.com/elazarl/go-bindata-assetfs"
	subicul "github.com/lucibus/lucibus/subicul"
	"golang.org/x/net/context"
)

func main() {
	subiculPort := 8080
	ctx := context.Background()
	app := subicul.MakeCliApp(ctx)
	var path string
	if len(os.Args) == 2 {
		path = os.Args[1]
	} else {
		path = ""
	}
	go app.Run([]string{"<executable path>", "--port", strconv.Itoa(subiculPort), "--path", path})
	staticPort := 8081
	http.Handle("/", http.FileServer(
		&assetfs.AssetFS{Asset: Asset, AssetDir: AssetDir, Prefix: "caido/dist"},
	))
	http.Handle("/schema.json", http.FileServer(
		&assetfs.AssetFS{Asset: Asset, AssetDir: AssetDir, Prefix: "api/"},
	))
	err := http.ListenAndServe(":"+strconv.Itoa(staticPort), nil)
	fmt.Println(err)
}
