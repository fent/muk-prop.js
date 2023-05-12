// A namespace is used so that a function can be used as the default export with
// the functions `restore` and `isMocked` attached. This keeps the old interface
// around and minimizes breaking changes.
namespace mukProp {
  export interface GetterSetter {
    get: () => any;
    set: (value: any) => void;
  }

  export interface mukPropFunc {
    (obj: Record<string, any>, key: string, value?: any | mukProp.GetterSetter): void;
    restore(): void;
    isMocked(obj: Record<string, any>, key: string): boolean;
  }
}

interface Mock {
  obj: Record<string, any>;
  key: string;
  descriptor?: PropertyDescriptor;
  hasOwnProperty: boolean;
}

// Keep track of mocks
let mocks: Mock[] = [];

// Used to check what objects and properties have been mocked.
const cache = new Map<object, Set<string>>();

function isGetterSetter(value: any | mukProp.GetterSetter): value is mukProp.GetterSetter {
  return !!value && (
    Object.prototype.hasOwnProperty.call(value, 'get') ||
    Object.prototype.hasOwnProperty.call(value, 'set')
  );
}


/**
 * Mocks a value of an object.
 *
 * @param {Object} obj
 * @param {string} key
 * @param {!Function|Object|GetterSetter} value
 */
let mukProp = ((obj: Record<string, any>, key: string, value?: any | mukProp.GetterSetter) => {
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

  const descriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: true,
  };

  if (value && isGetterSetter(value)) {
    // Default to undefined
    descriptor.get = value.get;
    descriptor.set = value.set;
  } else {
    // Without getter/setter mode
    descriptor.value = value;
    descriptor.writable = true;
  }

  Object.defineProperty(obj, key, descriptor);
}) as mukProp.mukPropFunc;

/**
 * Restore all mocks
 */
mukProp.restore = () => {
  for (let i = mocks.length - 1; i >= 0; i--) {
    let mock = mocks[i];
    if (!mock.hasOwnProperty) {
      // Delete the mock key, use key on the prototype
      delete mock.obj[mock.key];
    } else if (mock.descriptor) {
      // Redefine the origin key instead of the mock key
      Object.defineProperty(mock.obj, mock.key, mock.descriptor);
    }
  }
  mocks = [];
  cache.clear();
};

mukProp.isMocked = (obj: Record<string, any>, key: string) => {
  let flag = cache.get(obj);
  return flag ? flag.has(key) : false;
};


export = mukProp;
