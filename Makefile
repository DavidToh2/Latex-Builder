latex-base:
	docker build -f Dockerfile -t latexbase .

copy-docs:
	( \
	rm -r ./vue-frontend/docs/Development && \
	rm -r ./vue-frontend/docs/Production && \
	rm -r ./vue-frontend/docs/Server && \
	rm -r ./vue-frontend/docs/Frontend; \
	rm ./documentation/docs-hierarchy.json; \
	./scripts/generateDocHierarchy.sh $(PWD) && \
	cp -a ./documentation/. ./vue-frontend/docs && \
	./scripts/formatDocNames.sh $(PWD) \
	)

copy-schema:
	cp schema.json vue-frontend/src/assets/dropdown.json && \
	cp schema.json server/src/db/init/fields.json

.PHONY: latex-base copy-docs copy-schema