'use strict';

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

var path = require('path');
var unstream = require('unstream');
var through = require('through');

function getTransform(file, transforms) {
	for (var ext in transforms) {
		if (path.extname(file) === '.' + ext) {
			return transforms[ext];
		}
	}

	return false;
}

function transformMeta(transform) {
	if (typeof transform === 'string') {
		return { name: transform, opts: {} };
	} else {
		return {
			name: transform._[0],
			opts: transform
		};
	}
}

function createTransform(name) {
	var _name$split = name.split('?', 2);

	var _name$split2 = _slicedToArray(_name$split, 2);

	var modName = _name$split2[0];
	var path = _name$split2[1];

	var mod = module.parent.require(modName);
	return (path ? path.split('.') : []).reduce(function (o, k) {
		return o[k];
	}, mod);
}

function anyify(file, opts) {
	var transform = getTransform(file, opts);
	if (transform) {
		var _transformMeta = transformMeta(transform);

		var name = _transformMeta.name;
		var opts = _transformMeta.opts;

		var transformFn = createTransform(name);
		return unstream(function (data, callback) {
			try {
				callback(null, transformFn(data, opts));
			} catch (e) {
				callback(e);
			}
		});
	}

	return through();
}

module.exports = anyify;
