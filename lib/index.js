'use strict';

// Keep track of mocks
var mocks = [];
var cache = new Map();


/**
 * Mocks a method of an object.
 *
 * @param {Object} obj
 * @param {string} key
 * @param {!Function} method
 * @param {!Function} extend -  { getter(), setter() }
 */
var method = module.exports = (obj, key, method, extend) => {
  var noop = () => {};
  method = method === undefined ? noop : method;
  var hasOwnProperty = obj.hasOwnProperty(key);
  mocks.push({
    obj,
    key,
    descriptor: Object.getOwnPropertyDescriptor(obj, key),
    // Make sure the key exists on object not the prototype
    hasOwnProperty,
  });

  // Delete the origin key, redefine it below
  if (hasOwnProperty) {
    delete obj[key];
  }

  // Set a flag that checks if it is mocked
  var flag = cache.get(obj);
  if (!flag) {
    flag = new Set();
    cache.set(obj, flag);
  }
  flag.add(key);

  if (!method && extend) {
    // method->null use extend
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      get: extend.getter || noop,
      set: extend.setter || noop,
    });
  } else {
    Object.defineProperty(obj, key, {
      writable: true,
      configurable: true,
      enumerable: true,
      value: method,
    });
  }
};

/**
 * Restore all mocks
 */
method.restore = () => {
  for (var i = mocks.length - 1; i >= 0; i--) {
    var m = mocks[i];
    if (!m.hasOwnProperty) {
      // Delete the mock key, use key on the prototype
      delete m.obj[m.key];
    } else {
      // Redefine the origin key instead of the mock key
      Object.defineProperty(m.obj, m.key, m.descriptor);
    }
  }
  mocks = [];
  cache.clear();
};

method.isMocked = function isMocked(obj, key) {
  var flag = cache.get(obj);
  return flag ? flag.has(key) : false;
};
