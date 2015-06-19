all: lib/index.js

lib/%.js: src/%.js
	@mkdir -p ${@D}
	node_modules/.bin/babel $< -o $@

test: all test.js
	node_modules/.bin/mocha

.PHONY: test

