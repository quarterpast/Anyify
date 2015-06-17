var expect = require('chai').use(require('dirty-chai')).expect;
var concat = require('concat-stream');
var from   = require('from2-array');

var anyify = require('./');

describe('anyify', function() {
	it('should load a transform for an extension and execute it', function(done) {
		from(['hello'])
			.pipe(anyify('test.foo', {foo: './fixtures/a.js'}))
			.pipe(concat(function(data) {
				expect(data.toString()).to.equal('HELLO');
				done();
			}));
	});
});
