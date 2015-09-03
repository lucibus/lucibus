parse/api/main.go: ../api/schema.json ../api/valid/ ../api/invalid
	go run vendor/github.com/jteeuwen/go-bindata/go-bindata/*.go -o parse/api/main.go -pkg api -prefix "../api/"  ../api/schema.json ../api/valid/ ../api/invalid/

travis_install:
	go get github.com/Masterminds/glide
	glide up
	make parse/api/main.go

travis_script:
	go test -coverprofile=parse.coverprofile -v ./parse
	go test -coverprofile=main.coverprofile -v


travis_after_success:
	gover
	goveralls -coverprofile=gover.coverprofile -service=travis-ci

travis: travis_install travis_script travis_after_success

.PHONY: travis_install travis_script travis_after_success travis
