latex-base:
	docker build -f Dockerfile -t latexbase .

copy-docs:
	( \
	rm -r ./vue-frontend/docs/{development,production,server,vue-frontend}; \
	rm ./documentation/docs-hierarchy.json; \
	./scripts/generateDocHierarchy.sh $(PWD) && \
	cp -a ./documentation/. ./vue-frontend/docs && \
	./scripts/formatDocNames.sh $(PWD) \
	)

.PHONY: latex-base copy-docs