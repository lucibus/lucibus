FROM golang:1.4
RUN go get github.com/xeipuuv/gojsonschema

ADD validators/gojsonschema.go /code/gojsonschema.go

ADD sample.json /code/sample.json
ADD schema.json /code/schema.json

CMD go run /code/gojsonschema.go
