# Lucibus API

[![API Schema Docs](https://img.shields.io/badge/API Schema-docs-blue.svg)](http://lbovet.github.io/docson/index.html#https://rawgit.com/lucibus/lucibus/master/api/schema.json)

This repository stores the API/data structure schema and a sample of it.

The schema is in the form of [JSON Schema](http://json-schema.org/).

## Testing `sample.json` compliance

We currently test the `sample.json` compliance to the `schema.json` with three
validators, [**jsen**](https://github.com/bugventure/jsen), [**ajv**](https://github.com/epoberezkin/ajv),
 [tv4](http://geraintluff.github.io/tv4/), and [**gojsonschema**](https://github.com/xeipuuv/gojsonschema).


We currently skip ajv because it says some schemas fail, when they don't with
all others.

```bash
make build test
```
