const frozenEnum = function (values) {
  return {
    get: (self, prop) => {
      if (prop in self) return Reflect.get(self, prop);
      throw new Error(`${prop} is not enum. Valid options are ${values.join(', ')}.`);
    },
    set: (_self, prop) => {
      throw new Error(`Cannot set ${prop} in enum.`);
    },
  };
};

function Enumeration () {}
Enumeration.prototype.toString = function () {
  return `Enumeration { ${Object.keys(this).join(', ')} }`;
};
Enumeration.prototype.valueOf = function () {
  return Object.values(this);
};

const enumerize = function (values) {
  const someBadValues = values.some(v => typeof v !== 'string' || !v);
  if (values.length && someBadValues) {
    throw new Error(
      `enumerize() expects an array of strings, but you gave:\n${JSON.stringify(values)}`
    );
  }

  const target =
    values.reduce(function (memo, value) {
      memo[value] = Symbol(value);
      return memo;
    }, new Enumeration());

  return new Proxy(
    target,
    frozenEnum(values),
  );
};

const valueInEnum = function (enumeration, value) {
  if (!(enumeration instanceof Enumeration)) {
    throw new Error(
      `valueInEnum expects the first parameter to be the result of an enumerize(), but got ${typeof enumeration}`
    );
  }
  return enumeration.valueOf().indexOf(value) >= 0
};

const enumerizeWith = function (target, enumeration, key, defaultValue) {
  if (!(enumeration instanceof Enumeration)) {
    throw new Error(`enumerizeWith expects enumeration to be an instanceof Enumeration`);
  }

  const proxied = new Proxy(target, {
    set: function (self, prop, value) {
      if (prop === key && !valueInEnum(enumeration, value)) {
        throw new Error(`Cannot set '${prop}' to non-enum value (${enumeration.toString()})`);
      }
      return Reflect.set(self, prop, value);
    },
  });
  if (typeof defaultValue !== 'undefined') {
    proxied[key] = defaultValue;
  }

  return proxied;
};

module.exports.enumerize = enumerize;
module.exports.Enumeration = Enumeration;
module.exports.enumerizeWith = enumerizeWith;
module.exports.valueInEnum = valueInEnum;
