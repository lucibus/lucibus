FROM golang:1.5
RUN go get github.com/xeipuuv/gojsonschema

ADD validators/gojsonschema.go /code/gojsonschema.go

ADD schema.json /code/schema.json

CMD go run /code/gojsonschema.go
