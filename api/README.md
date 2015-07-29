# Lucibus API

[![API Schema Docs](https://img.shields.io/badge/API Schema-docs-blue.svg)](http://lbovet.github.io/docson/index.html#https://rawgit.com/lucibus/lucibus/master/api/schema.json)

This repository stores the API/data structure schema and a sample of it.

The schema is in the form of [JSON Schema](http://json-schema.org/).

## Testing `sample.json` compliance

We currently test the `sample.json` compliance to the `schema.json` with three
validators, [**jsen**](https://github.com/bugventure/jsen), [**ajv**](https://github.com/epoberezkin/ajv),
and [**gojsonschema**](https://github.com/xeipuuv/gojsonschema).

```bash
docker build -t lucibus/api-jsen -f validators/jsen.Dockerfile .
docker run --rm lucibus/api-jsen

docker build -t lucibus/api-ajv -f validators/ajv.Dockerfile .
docker run --rm lucibus/api-ajv

docker build -t lucibus/api-gojsonschema -f validators/gojsonschema.Dockerfile .
docker run --rm lucibus/api-gojsonschema
```
