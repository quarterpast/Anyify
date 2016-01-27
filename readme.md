# anyify

[![Build Status](https://travis-ci.org/quarterto/Anyify.svg?branch=master)](https://travis-ci.org/quarterto/Anyify)
[![npm version](https://badge.fury.io/js/anyify.svg)](https://npmjs.org/package/anyify)

## what is

a browserify transform for anything

## like what

like coffeescript:

```
browserify -t [ anyify --coffee [ coffee-script?compile ] ]
```

## go on

for a file extension (`--coffee`) load a thing (`coffee-script`) and do a thing (`compile`)

## ew, cli?

```js
var bundle = browserify(...);
bundle.transform('anyify', {
  'coffee': 'coffee-script?compile'
});
```

## licence

MIT
