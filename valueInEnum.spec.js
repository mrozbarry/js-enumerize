const { enumerize, valueInEnum } = require('.');
const test = require('ava');

test.beforeEach(t => {
  t.context.data = enumerize(['bar', 'baz', 'foo']);
});

test('valueInEnum throws if enumeration is not an Enumeration instance', t => {
  const notAnEnum = [
    'foo',
    123,
    [],
    {},
    false,
  ];

  t.plan(notAnEnum.length);

  notAnEnum.forEach(nonEnum => {
    t.throws(() => valueInEnum(nonEnum, 'test'), Error, `Was able to enumerize ${JSON.stringify(nonEnum)}`);
  });
});

test('valueInEnum detects if a value exists in the enumeration', t => {
  t.truthy(valueInEnum(t.context.data, t.context.data.bar));
});

test('valueInEnum returns false for values that are not in the enum', t => {
  const notIn = [
    Symbol('foo'),
    'foo',
    123,
    true,
    false
  ];

  notIn.forEach(v => {
    t.falsy(valueInEnum(t.context.data, v));
  });
});
