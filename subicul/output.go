package main

import (
	log "github.com/Sirupsen/logrus"
	"github.com/lucibus/dmx"
	"github.com/lucibus/lucibus/subicul/parse"
	"golang.org/x/net/context"
)

// Output will continuiously get the State from the context and try to output
// it to an output device
func Output(ctx context.Context, a dmx.Adaptor) {
	toOutput := make(chan parse.Output)
	go processOutput(ctx, toOutput, a)
	for {
		o, err := state.Output()
		if err != nil {
			log.WithFields(log.Fields{
				"package": "output",
				"err":     err,
				"state":   state,
			}).Error("can't get output for state")
			continue
		}
		select {
		case <-ctx.Done():
			return
		case toOutput <- o:
		}
	}
}

func processOutput(ctx context.Context, toOutput chan parse.Output, a dmx.Adaptor) {
	for {
		select {
		case <-ctx.Done():
			return
		case output := <-toOutput:
			err := a.OutputDMX(output, 512)
			if err != nil {
				log.WithFields(log.Fields{
					"package":     "output",
					"DMX adaptor": a,
					"err":         err,
					"output":      output,
				}).Error("can't output dimmers")
			}
		}
	}
}
