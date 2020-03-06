import Any from './any';

const validators = new Map();
validators.set(String, (v) => typeof v === 'string');
validators.set(Number, (v) => typeof v === 'number');
validators.set(Boolean, (v) => typeof v === 'boolean');
validators.set(Array, (v) => Array.isArray(v));
validators.set(Any, () => true);

const validateType = (Type, value) => {
  const validator = validators.get(Type);
  return validator ? validator(value) : value instanceof Type;
};

const enumerize = (definition, name = 'Enumeration') => {
  const keys = Object.keys(definition);

  class Enumeration {
    static toString() {
      return `${Enumeration.name}<${keys.join('|')}>`;
    }

    static caseOf(options, value) {
      const optionKeys = Object.keys(options);
      const invalidKeys = optionKeys.reduce((memo, key) => (key === '_' || keys.indexOf(key) >= 0 ? memo : [...memo, key]), []);

      if (invalidKeys.length > 0) throw new TypeError(`The key(s) ${invalidKeys.join(', ')} in your caseOf do not match ${Enumeration.name}<${keys.join('|')}>'s types`);
      if (optionKeys.length !== keys.length && !('_' in optionKeys)) throw new TypeError(`You are missing some keys in your ${Enumeration.toString()}.caseOf call, did you forget to add a key or use _?`);
      if (!(value instanceof Enumeration)) throw new TypeError(`${value.toString()} is not an instance of ${Enumeration.toString()}`);

      const [type, ...params] = value.valueOf();
      return options[type] ? options[type](...params) : options._();
    }

    constructor(type, ...params) {
      const typesToValidate = definition[type];

      this.valueOf = () => [type, ...params];
      this.toString = () => `${Enumeration.name}<${type}>(${typesToValidate.map((t) => t.name).join(', ')})`;

      params.forEach((param, index) => {
        const expectedType = typesToValidate[index];
        if (validateType(expectedType, param)) return;

        throw new Error(`${this.toString()} expects argument#${index} to be a ${expectedType.name}, but it was a ${typeof param}`);
      });
    }
  }

  keys.forEach((type) => {
    Enumeration[type] = (...params) => new Enumeration(type, ...params);
  });

  Object.defineProperty(Enumeration, 'name', { value: name });

  return Enumeration;
};

export default enumerize;
