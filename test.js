var expect = require('chai').use(require('dirty-chai')).expect;
var concat = require('concat-stream');
var from   = require('from2-array');

var anyify = require('./');

describe('anyify', function() {
	it('should load a transform for an extension and execute it', function(done) {
		from(['hello'])
			.pipe(anyify('test.foo', {foo: './fixtures/basic.js'}))
			.pipe(concat(function(data) {
				expect(data.toString()).to.equal('HELLO');
				done();
			}));
	});

	it('should handle an error in a transform', function(done) {
		from(['hello'])
			.pipe(anyify('test.foo', {foo: './fixtures/error.js'}))
			.on('error', function(e) {
				expect(e).to.be.an.instanceof(Error);
				expect(e.message).to.equal('error');
				done();
			});
	});

	it('should do nothing if no transform matches', function(done) {
		from(['hello'])
			.pipe(anyify('test.foo', {}))
			.pipe(concat(function(data) {
				expect(data.toString()).to.equal('hello');
				done();
			}));
	});
});
