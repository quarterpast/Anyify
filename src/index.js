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

function transformMeta(transform) {
	if(typeof transform === 'string') {
		return {name: transform, opts: {}};
	} else {
		return {
			name: transform._[0],
			opts: transform
		};
	}
}

function createTransform(name) {
	var [modName, path] = name.split('?', 2);
	var mod = module.parent.require(modName);
	return (path ? path.split('.') : []).reduce(
		(o, k) => o[k],
		mod
	);
}

function anyify(file, opts) {
	var transform = getTransform(file, opts);
	if(transform) {
		var {name, opts} = transformMeta(transform);
		var transformFn = createTransform(name);
		return unstream(function(data, callback) {
			try {
				callback(null, transformFn(data.toString(), opts));
			} catch(e) {
				callback(e);
			}
		});
	}

	return through();
}

module.exports = anyify;
