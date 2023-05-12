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
  descriptor?: PropertyDescriptor;
  hasOwnProperty: boolean;
}

// Keep track of mocks so that the user can know if an object property
// has been previously mocked, and to restore mocks.
const allMocks = new Map<Record<string, any>, Map<string, Mock>>();

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

  // Add to list of mocks.
  let objMocks = allMocks.get(obj);
  if (!objMocks) {
    objMocks = new Map();
    allMocks.set(obj, objMocks);
  }
  if (!objMocks.has(key)) {
    objMocks.set(key, {
      descriptor: Object.getOwnPropertyDescriptor(obj, key),
      // Make sure the key exists on object not the prototype
      hasOwnProperty,
    });
  }

  // Delete the origin key, redefine it below
  if (hasOwnProperty) {
    delete obj[key];
  }

  const mockDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: true,
  };

  if (value && isGetterSetter(value)) {
    // Default to undefined
    mockDescriptor.get = value.get;
    mockDescriptor.set = value.set;
  } else {
    // Without getter/setter mode
    mockDescriptor.value = value;
    mockDescriptor.writable = true;
  }

  Object.defineProperty(obj, key, mockDescriptor);
}) as mukProp.mukPropFunc;

/**
 * Restore all mocks
 */
mukProp.restore = () => {
  for (let [obj, objMocks] of allMocks.entries()) {
    for (let [key, mock] of objMocks.entries()) {
      if (!mock.hasOwnProperty) {
        // Delete the mock key, use key on the prototype
        delete obj[key];
      } else {
        // Redefine the origin key instead of the mock key
        Object.defineProperty(obj, key, mock.descriptor as PropertyDescriptor);
      }
    }
  }
  allMocks.clear();
};

mukProp.isMocked = (obj: Record<string, any>, key: string) => {
  let objMocks = allMocks.get(obj);
  return objMocks ? objMocks.has(key) : false;
};


export = mukProp;
