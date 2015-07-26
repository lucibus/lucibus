# Lucibus

*Modern stage lighting control system*

[![Circle CI](https://circleci.com/gh/lucibus/design.svg?style=svg)](https://circleci.com/gh/lucibus/design)
[![Schema/API Docs](https://img.shields.io/badge/schema%2Fapi-docs-blue.svg)](http://lbovet.github.io/docson/index.html#https://rawgit.com/lucibus/design/master/schema.json)

[schema docs](http://lbovet.github.io/docson/index.html#/docson/examples/example.json)

This repository stores the API/data structure schema and a sample of it.

The schema is in the form of [JSON Schema](http://json-schema.org/).

## Testing `sample.json` compliance

We currently test the `sample.json` compliance to the `schema.json` with three
validators, [**jsen**](https://github.com/bugventure/jsen), [**ajv**](https://github.com/epoberezkin/ajv),
and [**gojsonschema**](https://github.com/xeipuuv/gojsonschema).

```bash
docker build -t lucibus/design-jsen -f validators/jsen.Dockerfile .
docker run --rm lucibus/design-jsen

docker build -t lucibus/design-ajv -f validators/ajv.Dockerfile .
docker run --rm lucibus/design-ajv

docker build -t lucibus/design-gojsonschema -f validators/gojsonschema.Dockerfile .
docker run --rm lucibus/design-gojsonschema
```
