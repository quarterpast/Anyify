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
	return module.parent.require(s);
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
