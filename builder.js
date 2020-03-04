import { typeCheck } from './types';

const isFunction = (t) => t instanceof Function;

const ensureTypesAreFunctions = (types) => {
  if (types.every(isFunction)) return;

  throw new Error(
    `Enumeration expects an object in the format of \`name: [...functions]\`, but you gave:\n${JSON.stringify(types.map((t) => typeof t))}`,
  );
};

const ensureParamsLength = (key, types, params) => {
  if (params.length !== types.length) {
    const requires = types.length > 0
      ? types.map((t) => t.name).join(', ')
      : 'an empty parameter list';

    const given = params.length > 0
      ? params.map((p) => typeof p).join(', ')
      : 'an empty parameter list';

    throw new TypeError(`${key} requires ${requires}, but it was given ${given}`);
  }
};

const getParam = (param, type, onError) => {
  if (typeCheck(param, type)) {
    return param;
  }
  return onError();
};

const ensureTypesOfParams = (key, types, params) => {
  ensureParamsLength(key, types, params);

  return types.map((type, index) => {
    const param = params[index];
    return getParam(param, type, () => {
      throw new TypeError(`${key} requires ${types.map((t) => t.name).join(', ')}, but it was given ${params.map((p) => typeof p).join(', ')}`);
    });
  });
};

//
const reservedKeys = ['caseOf', 'toString', 'valueOf'];
const ensureKeyNotReserved = (key) => {
  if (reservedKeys.includes(key)) {
    throw new TypeError(`${key} is a reserved enum type`);
  }
};

//
const makeMethod = (key, types) => {
  ensureTypesAreFunctions(types);

  return (...params) => {
    const values = ensureTypesOfParams(key, types, params);
    return [key, ...values];
  };
};

// Build helper
const builder = (enumeration) => {
  const augmentor = {
    add: (key, types) => {
      ensureKeyNotReserved(key);

      Object.defineProperty(enumeration, key, {
        value: makeMethod(key, types),
        writable: false,
      });

      return augmentor;
    },
  };

  return augmentor;
};

export {
  makeMethod,
  builder,
};
