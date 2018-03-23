const { enumerize, enumerizeWith } = require('.');
const test = require('ava');

test('enumerizeWith throws when target is not an object', ava => {
  const nonObjects = [
    'test',
    Symbol('test'),
    true,
    123,
    null
  ];

  ava.plan(nonObjects.length);
  nonObjects.forEach(notObject => {
    ava.throws(() => enumerizeWith(notObject), Error, `Was able to set target to ${JSON.stringify(notObject)}`);
  });
});

test('enumerizeWith throws when enumeration is not an instance of Enumeration', ava => {
  const nonEnumerations = [
    {},
    [],
    'test',
    Symbol('test'),
    123,
    true,
    null,
  ];

  ava.plan(nonEnumerations.length);
  nonEnumerations.forEach(notEnum => {
    ava.throws(() => enumerizeWith({}, notEnum), Error);
  });
});

test('enumerizeWith returns a proxy of target', ava => {
  const e = enumerize(['a', 'b']);
  const target = {};
  const proxied = enumerizeWith(target, e, 'foo', e.a);
  ava.not(target, proxied);
});

test('enumerizeWith sets key to the default value if default is supplied', ava => {
  const e = enumerize(['a', 'b']);
  const target = {};
  const proxiedNoDefault = enumerizeWith(target, e, 'foo');
  ava.falsy(proxiedNoDefault.foo);
  const proxiedWithDefault = enumerizeWith(target, e, 'foo', e.a);
  ava.is(proxiedWithDefault.foo, e.a);
});

test('enumerizeWith throws an exception when target[value] is set to a non-enumeration value', ava => {
  const e = enumerize(['a', 'b']);
  const target = enumerizeWith({}, e, 'foo');
  ava.throws(() => target.foo = Symbol('a'), Error);
});

test('enumerizeWith does not throw an exception when target[value] is set to an enumeration value', ava => {
  const e = enumerize(['a', 'b']);
  const target = enumerizeWith({}, e, 'foo');
  ava.notThrows(() => target.foo = e.a);
});

test('enumerizeWith can be applied multiple times', ava => {
  const e1 = enumerize(['a', 'b']);
  const e2 = enumerize(['c', 'd']);
  const target = enumerizeWith(
    enumerizeWith({}, e1, 'foo'),
    e2,
    'bar'
  );

  ava.notThrows(() => target.foo = e1.a, Error);
  ava.throws(() => target.foo = e2.c, Error);
  ava.notThrows(() => target.bar = e2.c, Error);
  ava.throws(() => target.bar = e1.a, Error);
});
