# Subicul

```shell
$ subicul --help
NAME:
   subicul - lighting server

USAGE:
   subicul [global options] command [command options] [arguments...]

VERSION:
   0.0.0

COMMANDS:
   help, h	Shows a list of commands or help for one command

GLOBAL OPTIONS:
   --port "8080"	TCP port to listen on [$SUBICUL_PORT]
   --help, -h		show help
   --version, -v	print the version
```


# Installing

First install the library

```shell
go install github.com/lucibus/lucibus
```

# Testing

```
env GOPATH=`godep path`:$GOPATH goconvey
```

This won't test for race conditions. To do that run:

```
env GOPATH=`godep path`:$GOPATH go test -race -v ./...
```


# Dependencies
We use `godep` to manage versioning. Please [refer to their docs](https://github.com/tools/godep#edit-test-cycle)
for how to update and install new packages properly.
