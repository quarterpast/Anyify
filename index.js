var path = require('path');
var unstream = require('unstream');
var through = require('through');

function getTransform(file, transforms) {
	for(var ext in transforms) {
		if(path.extname(file) === '.' + ext) {
			return transforms[ext];
		}
	}

	return false;
}

function createTransform(s) {
	var bits = s.split('?', 2);
	var m = module.parent.require(bits[0]);
	var path = bits[1] ? bits[1].split('.') : [];
	return path.reduce(function(o, k) {
		return o[k];
	}, m);
}

function anyify(file, opts) {
	var transform = getTransform(file, opts);
	if(transform) {
		var transformFn = createTransform(transform);
		return unstream(function(data, callback) {
			try {
				callback(null, transformFn(data));
			} catch(e) {
				callback(e);
			}
		});
	}

	return through();
}

module.exports = anyify;
