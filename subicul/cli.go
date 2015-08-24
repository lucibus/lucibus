package subicul

import (
	"log"

	"golang.org/x/net/context"

	"github.com/codegangsta/cli"

	"github.com/lucibus/dmx"
)

// type FileDMXAdaptor struct {
// 	Path       string
// 	prevOutput lige.State
// }
//
// func (fod FileDMXAdaptor) Set(s lige.State) error {
// 	if !reflect.DeepEqual(s, fod.prevOutput) {
// 		outputMap := make(map[string]int)
// 		for address, value := range s {
// 			outputMap[strconv.Itoa(address)] = int(value)
// 		}
// 		outputString, err := json.Marshal(outputMap)
// 		if err != nil {
// 			return err
// 		}
// 		return ioutil.WriteFile(fod.Path, outputString, 0644)
// 	}
// 	return nil
// }

func MakeCliApp(ctx context.Context) *cli.App {
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
		cli.StringFlag{
			Name:   "path",
			Usage:  "serial path for the enttec USB pro device",
			EnvVar: "SUBICUL_PATH",
		},
	}

	app.Action = func(c *cli.Context) {
		var a dmx.Adaptor
		if c.String("path") == "" {
			a = dmx.NewDebugAdaptor()
		} else {
			a = dmx.NewUSBEnttecProAdaptor(
				"dmx",
				c.String("path"),
			)
		}

		// od := lige.DummyDMXAdaptor{}
		err := MakeStateServer(ctx, c.Int("port"), a)
		if err != nil {
			log.Fatalln(err)
		}
		<-ctx.Done()
	}
	return app
}
