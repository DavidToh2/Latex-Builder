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

copy-schema:
	cp schema.json vue-frontend/src/assets/dropdown.json && \
	cp schema.json server/src/db/init/fields.json

.PHONY: latex-base copy-docs copy-schema