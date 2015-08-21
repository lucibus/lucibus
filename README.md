# Lucibus

*Modern stage lighting control system*

[![Circle CI](https://circleci.com/gh/lucibus/lucibus.svg?style=svg)](https://circleci.com/gh/lucibus/lucibus)
[![Build Status](https://travis-ci.org/lucibus/lucibus.svg)](https://travis-ci.org/lucibus/lucibus)
[![Coverage Status](https://coveralls.io/repos/lucibus/lucibus/badge.svg)](https://coveralls.io/r/lucibus/lucibus)
[![Sauce Test Status](https://saucelabs.com/browser-matrix/sshanabrook.svg)](https://saucelabs.com/u/sshanabrook)


## Running in Production

To install, [download the binary](https://bintray.com/lucibus/lucibus/lucibus/view#files)
and execute it. To output on a DMX USB Pro device, pass in the path to the serial
port as the first argument.

## Development

### Setup

```bash
git clone https://github.com/lucibus/lucibus.git
cd lucibus
go get github.com/Masterminds/glide
glide up
```

### Dependencies
We use `glide` to manage versioning. Please [refer to their docs](https://github.com/Masterminds/glide/)
for how to update and install new packages properly.


### Building

To build run `make`. This will build the `./subicul` executable. Running
this will start the HTML server on port 80 and the websocket server on port
8080.


