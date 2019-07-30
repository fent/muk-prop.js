# muk-prop.js

[![Build Status](https://secure.travis-ci.org/fent/muk-prop.js.svg)](http://travis-ci.org/fent/muk-prop.js)
[![Dependency Status](https://david-dm.org/fent/muk-prop.js.svg)](https://david-dm.org/fent/muk-prop.js)
[![codecov](https://codecov.io/gh/fent/muk-prop.js/branch/master/graph/badge.svg)](https://codecov.io/gh/fent/muk-prop.js) [![Greenkeeper badge](https://badges.greenkeeper.io/fent/muk-prop.js.svg)](https://greenkeeper.io/)

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
