# Subicul

[![Build Status](https://travis-ci.org/lucibus/subicul.svg)](https://travis-ci.org/lucibus/subicul)
[![Coverage Status](https://coveralls.io/repos/lucibus/subicul/badge.svg)](https://coveralls.io/r/lucibus/subicul)


# Installing

First install the library

```shell
go install github.com/lucibus/subicul
```

# Testing

```
goconvey
```

This won't test for race conditions. To do that run:

```
go test -race -v ./...
```


# Dependencies
We use `godep` to manage versioning. Please [refer to their docs](https://github.com/tools/godep#edit-test-cycle)
for how to update and install new packages properly.
