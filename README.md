# muk-prop

[![Build Status](https://secure.travis-ci.org/fent/node-muk-prop.svg)](http://travis-ci.org/fent/node-muk-prop)
[![Dependency Status](https://gemnasium.com/fent/node-muk-prop.svg)](https://gemnasium.com/fent/node-muk-prop)
[![codecov](https://codecov.io/gh/fent/node-muk-prop/branch/master/graph/badge.svg)](https://codecov.io/gh/fent/node-muk-prop)

![muk](muk.gif)

# Usage

Object method mocking.

```js
var fs = require('fs');
var muk = require('muk-prop');

muk(fs, 'readFile', function(path, callback) {
  process.nextTick(callback.bind(null, null, 'file contents here'));
});
```

Check if member has been mocked.

```js
muk.isMocked(fs, 'readFile'); // true
```

Restore all mocked methods after tests.

```js
muk.restore();

fs.readFile(file, function(err, data) {
  // will actually read from `file`
});
```


# Install

    npm install muk-prop


# Tests
Tests are written with [mocha](http://visionmedia.github.com/mocha/)

```bash
npm test
```

# too License
MIT
