default: lucibus

caido/dist/index.html /dist/main.css /dist/main.js: $(wildcard caido/app/*)
	cd caido; npm install; npm run build

bindata_assetfs.go: api/schema.json caido/dist/index.html
	go run vendor/github.com/jteeuwen/go-bindata/go-bindata/*.go api/schema.json caido/dist

lucibus: bindata_assetfs.go main.go $(wildcard subicul/**/*)
	cd subicul; glide up
	go build

bintray.json: bintray.json.tmpl
	sed "s/{date}/$(shell date +%F)/g; s/{name}/$(TRAVIS_COMMIT)/; s/{desc}/from Travis build $(TRAVIS_BUILD_NUMBER)/" bintray.json.tmpl > bintray.json

