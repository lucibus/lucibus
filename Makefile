default: lucibus

caido/dist/index.html /dist/main.css /dist/main.js: $(wildcard caido/app/*)
	cd caido; npm install; npm run build

bindata_assetfs.go: api/schema.json caido/dist/index.html
	go get github.com/jteeuwen/go-bindata/...
	go get github.com/elazarl/go-bindata-assetfs/...
	go-bindata-assetfs api/schema.json caido/dist

lucibus: bindata_assetfs.go main.go $(wildcard subicul/**/*)
	go get github.com/tools/godep
	cd subicul/; godep restore
	go build

bintray.json: bintray.json.tmpl
	sed "s/{date}/$(shell date +%F)/g; s/{name}/$(TRAVIS_COMMIT)/; s/{desc}/from Travis build $(TRAVIS_BUILD_NUMBER)/" bintray.json.tmpl > bintray.json

