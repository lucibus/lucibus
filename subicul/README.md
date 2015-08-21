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

This requires go 1.5 for versioning support


```bash
git clone https://github.com/lucibus/lucibus.git
cd lucibus/subicul
go get github.com/Masterminds/glide
glide up
```

# Testing

```bash
go test -race -v . ./parse
```

Or for live testing:

```bash
go run vendor/github.com/smartystreets/goconvey/goconvey.go -depth 2
```

# Dependencies
We use `glide` to manage versioning. Please [refer to their docs](https://github.com/Masterminds/glide/)
for how to update and install new packages properly.

To add a new package:

```
glide get github.com/Masterminds/cookoo
```