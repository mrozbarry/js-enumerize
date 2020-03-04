import { Any } from './any';

// Cast
const toType = (value, TypeFn) => {
  if (TypeFn === Array) {
    return [...value];
  }
  return new TypeFn(value);
};

// Type check
const primitiveTypeCheckMap = new Map();
primitiveTypeCheckMap.set(String, (v) => typeof v === 'string');
primitiveTypeCheckMap.set(Number, (v) => typeof v === 'number');
primitiveTypeCheckMap.set(Boolean, (v) => typeof v === 'boolean');
primitiveTypeCheckMap.set(Array, (v) => Array.isArray(v));

const typeCheck = (p, typeFn) => {
  if (typeFn === Any) {
    return true;
  }
  const primitiveFn = primitiveTypeCheckMap.get(typeFn);
  return (primitiveFn && primitiveFn(p))
    || (p instanceof typeFn);
};

export {
  toType,
  typeCheck,
};
