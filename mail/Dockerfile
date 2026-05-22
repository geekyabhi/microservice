FROM golang:1.21-alpine AS build

WORKDIR /app

COPY go.* ./
RUN go mod download

COPY . .
RUN go build -o /app/mail .

FROM alpine:latest
RUN apk --no-cache add ca-certificates

WORKDIR /app
COPY --from=build /app/mail .

ENTRYPOINT ["/app/mail"]
