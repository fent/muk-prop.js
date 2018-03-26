# muk-prop.js

[![Build Status](https://secure.travis-ci.org/fent/muk-prop.js.svg)](http://travis-ci.org/fent/muk-prop.js)
[![Dependency Status](https://david-dm.org/fent/muk-prop.js.svg)](https://david-dm.org/fent/muk-prop.js)
[![codecov](https://codecov.io/gh/fent/muk-prop.js/branch/master/graph/badge.svg)](https://codecov.io/gh/fent/muk-prop.js)

![muk](muk.gif)

# Usage

Object method mocking.

```js
const fs = require('fs');
const muk = require('muk-prop');

muk(fs, 'readFile', (path, callback) => {
  process.nextTick(callback.bind(null, null, 'file contents here'));
});
```

Object props mocking with setter/getter.

```js
const muk = require('muk-prop');

const obj = { _a: 1 };
muk(obj, 'a', {
  set: function(val) { this._a = val; },
  get: function(val) { return this._a; },
});

obj.a = 2;
// now we try to get obj._a
console.log(obj._a); // 2
```

Check if member has been mocked.

```js
muk.isMocked(fs, 'readFile'); // true
```

Restore all mocked methods/props after tests.

```js
muk.restore();

fs.readFile(file, (err, data) => {
  // will actually read from `file`
});
```


# Install

    npm install muk-prop


# Tests
Tests are written with [mocha](https://mochajs.org)

```bash
npm test
```
