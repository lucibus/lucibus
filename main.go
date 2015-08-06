package main

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/elazarl/go-bindata-assetfs"
	subicul "github.com/lucibus/lucibus/subicul"
	"golang.org/x/net/context"
)

func main() {
	subiculPort := 8080
	ctx := context.Background()
	app := subicul.MakeCliApp(ctx)
	go app.Run([]string{"<executable path>", "--port", strconv.Itoa(subiculPort)})
	staticPort := 80
	http.Handle("/", http.FileServer(
		&assetfs.AssetFS{Asset: Asset, AssetDir: AssetDir, Prefix: "caido/dist"},
	))
	http.Handle("/schema.json", http.FileServer(
		&assetfs.AssetFS{Asset: Asset, AssetDir: AssetDir, Prefix: "api/"},
	))
	err := http.ListenAndServe(":"+strconv.Itoa(staticPort), nil)
	fmt.Println(err)
}
