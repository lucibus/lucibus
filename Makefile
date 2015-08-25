default: travis

caido/dist/index.html: $(wildcard caido/app/*)
	cd caido; npm run build

bindata_assetfs.go: api/schema.json caido/dist/index.html
	go run vendor/github.com/jteeuwen/go-bindata/go-bindata/*.go api/schema.json caido/dist

lucibus: bindata_assetfs.go main.go $(wildcard subicul/**/*)
	go build

bintray.json: bintray.json.tmpl
	sed "s/{date}/$(shell date +%F)/g; s/{name}/$(TRAVIS_COMMIT)/; s/{desc}/from Travis build $(TRAVIS_BUILD_NUMBER)/" bintray.json.tmpl > bintray.json

travis_install:
	wget https://www.browserstack.com/browserstack-local/BrowserStackLocal-linux-x64.zip
	unzip BrowserStackLocal-linux-x64.zip
	go get github.com/Masterminds/glide
	glide up
	cd subicul; make travis_install
	cd caido; make travis_install
	make lucibus
	npm install
	# go get github.com/alexanderGugel/wsd

travis_script:
	npm run lint
	./BrowserStackLocal -v -onlyAutomate -forcelocal $$BROWSERSTACK_ACCESS_KEY &
	npm run test:server &
	sleep 5
	# wsd -url "ws://localhost:8080" &
	npm test


travis_after_success:

travis: travis_install travis_script travis_after_success

.PHONY: travis_install travis_script travis_after_success travis
