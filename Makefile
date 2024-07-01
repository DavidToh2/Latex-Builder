latex-base:
	docker build -f Dockerfile -t latexbase .

copy-docs:
	( \
	rmdir ./vue-frontend/public/docs; \
	cp -r ./documentation ./vue-frontend/public/docs \
	)

.PHONY: latex-base copy-docs