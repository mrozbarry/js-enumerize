import { builder } from './builder';

const rawKey = Symbol('raw');

class Enumeration {
  constructor(declaration = {}) {
    this[rawKey] = { ...declaration };
    const b = builder(this);
    Object.keys(declaration)
      .forEach((key) => {
        b.add(key, declaration[key]);
      });
  }

  toString() {
    const data = Object.keys(this[rawKey])
      .map((key) => {
        const types = this[rawKey][key];
        return `${key}<${types.map((p) => p.name).join(', ')}>`;
      })
      .join(', ');

    return `Enumeration { ${data} }`;
  }

  valueOf() {
    return this[rawKey];
  }

  caseOf(options, [key, ...params]) {
    const optionKeys = Object.keys(options);
    const enumKeys = Object.keys(this[rawKey]);
    if (optionKeys.length !== enumKeys.length && !options._) {
      throw new SyntaxError(
        `Enumeration caseOf must either match against all keys (${enumKeys.join(', ')}), or add a \`_: () => {}\` as a default fall-through.`,
      );
    }
    return options[key]
      ? options[key](...params)
      : options._();
  }
}

export {
  Enumeration,
};
