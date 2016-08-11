NAME ?= egergo/daheim-app-ui
VERSION ?= 0.1

.PHONY: all build tag_latest release builder_image builder run

all: build

builder_image:
	docker build -t $(NAME)-builder .

build/builder/Dockerfile: builder_image
	rm -rf build/builder
	mkdir -p build/builder
	docker run $(NAME)-builder | tar -C build/builder -x -

builder: build/builder/Dockerfile

build: builder
	docker build -t $(NAME):$(VERSION) build/builder

run: build
	docker run --rm -p 80:80 -p 443:443 $(NAME):$(VERSION)

tag_latest:
	docker tag -f $(NAME):$(VERSION) $(NAME):latest

release: tag_latest
	@if ! docker images $(NAME) | awk '{ print $$2 }' | grep -q -F $(VERSION); then echo "$(NAME) version $(VERSION) is not yet built. Please run 'make build'"; false; fi
	docker push $(NAME)
