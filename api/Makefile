parse/schema_file.go: ../api/schema.json
	go run vendor/github.com/jteeuwen/go-bindata/go-bindata/*.go -o parse/schema_file.go -pkg parse -prefix "../api/"  ../api/schema.json

travis_install:
	go get github.com/Masterminds/glide
	glide up
	make parse/schema_file.go

travis_script:
	go test -coverprofile=parse.coverprofile -v -race ./parse
	go test -coverprofile=main.coverprofile -v -race


travis_after_success:
	gover
	goveralls -coverprofile=gover.coverprofile -service=travis-ci

.PHONY: travis_install travis_script travis_after_success
