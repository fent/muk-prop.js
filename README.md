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
  set: (val) => obj._a = val * 2,
  get: (val) => obj._a,
});

obj.a = 2;
console.log(obj.a); // 4
```

Map props mocking.
```js
const muk = require('muk-prop');
const obj = { a: 1 };
muk(obj, 'a', new Map());
obj.a.set('test', 1);
obj.a.get('test'); // 1
```

Set props mocking.
```js
const muk = require('muk-prop');
const obj = { a: 1 };
muk(obj, 'a', new Set());
obj.a.add('test');
obj.a.has('test'); // true
console.log(obj.a.size); // 1
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
