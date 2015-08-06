# Lucibus

*Modern stage lighting control system*

[![Circle CI](https://circleci.com/gh/lucibus/lucibus.svg?style=svg)](https://circleci.com/gh/lucibus/lucibus)
[![Build Status](https://travis-ci.org/lucibus/lucibus.svg)](https://travis-ci.org/lucibus/lucibus)


To install, [download the binary](https://bintray.com/lucibus/lucibus/lucibus/view#files)
and execute it. To output on a DMX USB Pro device, pass in the path to the serial
port as the first argument. 

## Development

To build run `make`. This will build the `./subicul` executable. Running
this will start the HTML server on port 80 and the websocket server on port
8080.
