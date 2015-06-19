module.exports = function(src, opts) {
	console.assert(opts.baz === 'quux', 'baz should be quux, but it was ' + opts.baz);
	return src.toString().toUpperCase();
};
