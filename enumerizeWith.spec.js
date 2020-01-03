const { enumerize, enumerizeWith } = require('.');
const test = require('ava');

test('enumerizeWith throws when target is not an object', t => {
  const nonObjects = [
    'test',
    Symbol('test'),
    true,
    123,
    null
  ];

  t.plan(nonObjects.length);
  nonObjects.forEach(notObject => {
    t.throws(() => enumerizeWith(notObject), Error, `Was able to set target to ${JSON.stringify(notObject)}`);
  });
});

test('enumerizeWith throws when enumeration is not an instance of Enumeration', t => {
  const nonEnumerations = [
    {},
    [],
    'test',
    Symbol('test'),
    123,
    true,
    null,
  ];

  t.plan(nonEnumerations.length);
  nonEnumerations.forEach(notEnum => {
    t.throws(() => enumerizeWith({}, notEnum), Error);
  });
});

test('enumerizeWith returns a proxy of target', t => {
  const e = enumerize(['a', 'b']);
  const target = {};
  const proxied = enumerizeWith(target, e, 'foo', e.a);
  t.not(target, proxied);
});

test('enumerizeWith sets key to the default value if default is supplied', t => {
  const e = enumerize(['a', 'b']);
  const target = {};
  const proxiedNoDefault = enumerizeWith(target, e, 'foo');
  t.falsy(proxiedNoDefault.foo);
  const proxiedWithDefault = enumerizeWith(target, e, 'foo', e.a);
  t.is(proxiedWithDefault.foo, e.a);
});

test('enumerizeWith throws an exception when target[value] is set to a non-enumeration value', t => {
  const e = enumerize(['a', 'b']);
  const target = enumerizeWith({}, e, 'foo');
  t.throws(() => target.foo = Symbol('a'), Error);
});

test('enumerizeWith does not throw an exception when target[value] is set to an enumeration value', t => {
  const e = enumerize(['a', 'b']);
  const target = enumerizeWith({}, e, 'foo');
  t.notThrows(() => target.foo = e.a);
});

test('enumerizeWith can be applied multiple times', t => {
  const e1 = enumerize(['a', 'b']);
  const e2 = enumerize(['c', 'd']);
  const target = enumerizeWith(
    enumerizeWith({}, e1, 'foo'),
    e2,
    'bar'
  );

  t.notThrows(() => target.foo = e1.a);
  t.throws(() => target.foo = e2.c);
  t.notThrows(() => target.bar = e2.c);
  t.throws(() => target.bar = e1.a);
});
