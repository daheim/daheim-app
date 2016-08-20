NAME ?= egergo/daheim-app

.PHONY: all build tag_latest release builder_image builder

all: build

builder_image:
	docker build -f Dockerfile.builder -t $(NAME)-builder .

builder: builder_image
	rm -rf build/builder
	mkdir -p build
	docker run --rm $(NAME)-builder | tar x -C build

build: builder
	cp Dockerfile.final build/builder/Dockerfile
	cp .dockerignore.final build/builder/.dockerignore
	docker build -t $(NAME):$(shell cat build/builder/REVISION) build/builder

tag_latest:
	docker tag $(NAME):$(shell cat build/builder/REVISION) $(NAME):latest

release: tag_latest
	docker push $(NAME)
