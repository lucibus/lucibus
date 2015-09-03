# binary

## Running in Production

To install, [download the binary](https://bintray.com/lucibus/lucibus/lucibus/view#files)
and execute it. To output on a DMX USB Pro device, pass in the path to the serial
port as the first argument.

## Development

### Dependencies
We need go version 1.5

Also you have to set `GO15VENDOREXPERIMENT=1`

We use `glide` to manage versioning. Please [refer to their docs](https://github.com/Masterminds/glide/)
for how to update and install new packages properly.

### Setup

```bash
mkdir -p $GOPATH/src/github.com/lucibus
cd $GOPATH/src/github.com/lucibus
git clone https://github.com/lucibus/lucibus.git
cd lucibus
go get github.com/Masterminds/glide
glide up
```


### Building

To build run `make`. This will build the `./subicul` executable. Running
this will start the HTML server on port 80 and the websocket server on port
8080.

### Testing


There are some integration test that make sure the server is working:


```bash
npm run test:selenium
npm run test:server
npm run test
```
