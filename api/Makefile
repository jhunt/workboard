IMAGE ?= iamjameshunt/workboard-api

dev:
	node index.js

build:
	docker build -t $(IMAGE) .
push: build
	docker push $(IMAGE)
