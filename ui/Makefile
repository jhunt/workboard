IMAGE ?= iamjameshunt/workboard-ui

build:
	docker build -t $(IMAGE) .
push: build
	docker push $(IMAGE)
