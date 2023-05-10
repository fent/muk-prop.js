'use strict';

// Keep track of mocks
let mocks = [];
const cache = new Map();


/**
 * Mocks a value of an object.
 *
 * @param {Object} obj
 * @param {string} key
 * @param {!Function|Object} value
 */
const method = module.exports = (obj, key, value) => {
  const hasOwnProperty = Object.prototype.hasOwnProperty.call(obj, key);
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
  let flag = cache.get(obj);
  if (!flag) {
    flag = new Set();
    cache.set(obj, flag);
  }
  flag.add(key);

  const descriptor = {
    configurable: true,
    enumerable: true,
  };

  if (value && (value.get || value.set)) {
    // Default to undefined
    descriptor.get = value.get;
    descriptor.set = value.set;
  } else {
    // Without getter/setter mode
    descriptor.value = value;
    descriptor.writable = true;
  }

  Object.defineProperty(obj, key, descriptor);
};

/**
 * Restore all mocks
 */
method.restore = () => {
  for (let i = mocks.length - 1; i >= 0; i--) {
    let m = mocks[i];
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

method.isMocked = (obj, key) => {
  let flag = cache.get(obj);
  return flag ? flag.has(key) : false;
};
