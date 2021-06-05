IMAGE ?= iamjameshunt/workboard-ui

dev:
	yarn serve

build:
	docker build -t $(IMAGE) .
push: build
	docker push $(IMAGE)
