default: parse/schema_file.go
	
parse/schema_file.go: ../api/schema.json
	go run vendor/github.com/jteeuwen/go-bindata/go-bindata/*.go -o parse/schema_file.go -pkg parse -prefix "../api/"  ../api/schema.json