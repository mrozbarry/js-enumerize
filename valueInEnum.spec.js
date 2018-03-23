const { enumerize, valueInEnum } = require('.');
const test = require('ava');

test.beforeEach(ava => {
  ava.context.data = enumerize(['bar', 'baz', 'foo']);
});

test('valueInEnum throws if enumeration is not an Enumeration instance', ava => {
  const notAnEnum = [
    'foo',
    123,
    [],
    {},
    false,
  ];

  ava.plan(notAnEnum.length);

  notAnEnum.forEach(nonEnum => {
    ava.throws(() => valueInEnum(nonEnum, 'test'), Error, `Was able to enumerize ${JSON.stringify(nonEnum)}`);
  });
});

test('valueInEnum detects if a value exists in the enumeration', ava => {
  ava.truthy(valueInEnum(ava.context.data, ava.context.data.bar));
});

test('valueInEnum returns false for values that are not in the enum', ava => {
  const notIn = [
    Symbol('foo'),
    'foo',
    123,
    true,
    false
  ];

  notIn.forEach(v => {
    ava.falsy(valueInEnum(ava.context.data, v));
  });
});
