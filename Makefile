default: lucibus

caido/dist/index.html /dist/main.css /dist/main.js: $(wildcard caido/app/*)
	cd caido; npm run build

bindata_assetfs.go: api/schema.json $(wildcard caido/dist/*)
	go-bindata-assetfs api/schema.json caido/dist

lucibus: bindata_assetfs.go main.go $(wildcard subicul/**/*)
	go build

