var path = require('path');
var unstream = require('unstream');
var through = require('through');

function getTransform(file, transforms) {
	for(let ext in transforms) {
		if(path.extname(file) === '.' + ext) {
			return transforms[ext];
		}
	}
	return false;
}

function transformMeta(transform) {
	return {
		name: typeof transform === 'string' ? transform : transform._[0],
		opts: typeof transform === 'string' ? {} : transform
	};
}

function createTransform(name) {
	let [modName, path] = name.split('?', 2);
	return (path ? path.split('.') : []).reduce(
		(o, k) => o[k],
		module.parent.require(modName)
	);
}

function anyify(file, opts) {
	let transform = getTransform(file, opts);
	if(transform) {
		let {name, opts} = transformMeta(transform);
		let transformFn = createTransform(name);
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
