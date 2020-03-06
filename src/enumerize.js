import Any from './any';

const validators = new Map();
validators.set(String, (v) => typeof v === 'string');
validators.set(Number, (v) => typeof v === 'number');
validators.set(Boolean, (v) => typeof v === 'boolean');
validators.set(Array, (v) => Array.isArray(v));
validators.set(Any, () => true);

const validateType = (Type, value) => {
  const validator = validators.get(Type);
  return validator
    ? validator(value)
    : value instanceof Type;
};

const enumerize = (definition, name = 'Enumeration') => {
  const keys = Object.keys(definition);

  const Enumeration = class {
    constructor(type, ...params) {
      const typesToValidate = definition[type];
      for (let index = 0; index < params.length; index += 1) {
        const param = params[index];
        const expectedType = typesToValidate[index];
        if (!validateType(typesToValidate[index], param)) {
          throw new Error(`${Enumeration.name}<${type}> expects argument#${index} to be a ${expectedType.name}, but it was a ${typeof param}`);
        }
      }

      this.valueOf = () => [type, ...params];
      this.toString = () => `${Enumeration.name}<${type}>(${params.map((p) => p.toString()).join(', ')})`;
    }
  };

  Enumeration.toString = () => `${Enumeration.name}<${keys.join('|')}>`;

  keys.forEach((type) => {
    Enumeration[type] = (...params) => new Enumeration(type, ...params);
  });

  Object.defineProperty(Enumeration, 'name', { value: name });

  Enumeration.caseOf = (options, value) => {
    const optionKeys = Object.keys(options);
    const invalidKeys = [];
    for (const key of optionKeys) { // eslint-disable-line no-restricted-syntax
      if (key === '_') continue; // eslint-disable-line no-continue

      if (keys.indexOf(key) < 0) {
        invalidKeys.push(key);
      }
    }
    if (invalidKeys.length > 0) {
      throw new TypeError(`The key(s) ${invalidKeys.join(', ')} in your caseOf do not match ${Enumeration.name}<${keys.join('|')}>'s types`);
    }
    if (optionKeys.length !== keys.length && !('_' in optionKeys)) {
      throw new TypeError(`You are missing some keys in your ${Enumeration.name}<${keys.join('|')}>.caseOf call, did you forget to add a key or use _?`);
    }

    if (!(value instanceof Enumeration)) {
      throw new TypeError(`${value.toString()} is not an instance of ${Enumeration.name}<${keys.join('|')}>`);
    }
    const [type, ...params] = value.valueOf();
    return options[type]
      ? options[type](...params)
      : options._();
  };

  return Enumeration;
};

export default enumerize;
