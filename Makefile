build-base:
	docker build -f Dockerfile -t latexbase .

.PHONY: build-base