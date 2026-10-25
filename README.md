# muk-prop.js

[![npm](https://img.shields.io/npm/v/muk-prop)](https://www.npmjs.com/package/muk-prop)
[![Node.js CI](https://github.com/fent/muk-prop.js/actions/workflows/nodejs.yml/badge.svg)](https://github.com/fent/muk-prop.js/actions/workflows/nodejs.yml)
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

Object property mocking with getter/setter.

```js
const muk = require('muk-prop');

const obj = { _a: 1 };
muk(obj, 'a', {
  get: (val) => obj._a,
  set: (val) => (obj._a = val * 2),
});

obj.a = 2;
console.log(obj.a); // 4
```

Check if property has been mocked.

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
