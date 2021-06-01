IMAGE ?= iamjameshunt/workboard-api

build:
	docker build -t $(IMAGE) .
push: build
	docker push $(IMAGE)
