package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"os"
	"reflect"
	"runtime"
	"strconv"

	"golang.org/x/net/context"

	"github.com/codegangsta/cli"

	lige "github.com/lucibus/lige/output"
	"github.com/lucibus/lucibus/subicul/websocketserver"
)

type FileOutputDevice struct {
	Path       string
	prevOutput lige.State
}

func (fod *FileOutputDevice) Set(s lige.State) error {
	if !reflect.DeepEqual(s, fod.prevOutput) {
		outputMap := make(map[string]int)
		for address, value := range s {
			outputMap[strconv.Itoa(address)] = int(value)
		}
		outputString, err := json.Marshal(outputMap)
		if err != nil {
			return err
		}
		return ioutil.WriteFile(fod.Path, outputString, 0644)
	}
	return nil
}

func makeCliApp(ctx context.Context) *cli.App {
	app := cli.NewApp()
	app.Name = "subicul"
	app.Usage = "lighting server"

	app.Flags = []cli.Flag{
		cli.IntFlag{
			Name:   "port",
			Value:  8080,
			Usage:  "TCP port to listen on",
			EnvVar: "SUBICUL_PORT",
		},
	}

	app.Action = func(c *cli.Context) {
		// od := lige.ENTTECUSBProOutputDevice{
		// 	COMPort: "/dev/tty.usbserial-EN158833",
		// }
		// od := lige.DummyOutputDevice{}
		od := FileOutputDevice{Path: "/tmp/subicul"}
		err := websocketserver.MakeStateServer(ctx, c.Int("port"), &od)
		if err != nil {
			log.Fatalln(err)
		}
		<-ctx.Done()
	}
	return app
}

func main() {
	runtime.GOMAXPROCS(runtime.NumCPU())
	app := makeCliApp(context.Background())
	app.Run(os.Args)
}
