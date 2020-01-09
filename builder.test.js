const { builder, makeMethod } = require('./builder');
const { Enumeration } = require('./enumeration');

const test = require('ava');

test('makeMethod ensures all types are functions', t => {
  t.throws(
    () => makeMethod('foo', ['not a function']),
    Error,
    'Enumeration expects an object in the format of `name: [...functions]`, but you gave:\n[\'string\']',
  );
});

test('makeMethod generates a method that guarantees the parameter length', t => {
  const withType = makeMethod('foo', [String]);
  const withoutType = makeMethod('foo', []);

  t.throws(
    () => withType(),
    TypeError,
    'foo requires String, but it was given an empty parameter list',
  );

  t.throws(
    () => withoutType('test'),
    TypeError,
    'foo requires an empty parameter list, but it was given string',
  );
});

test('makeMethod generates a method that throws if types do not match', t => {
  const method = makeMethod('foo', [Date]);
  t.throws(
    () => method({ bad: true }),
    'foo requires Date, but it was given object',
  );
});

test('builder returns an object with an add function', t => {
  const b = builder();

  t.deepEqual(Object.keys(b), ['add']);
  t.is(typeof b.add, 'function');
});

test('builder.adds type functions to the enumeration argument (mutation)', t => {
  const e = new Enumeration({});
  const b = builder(e);

  t.deepEqual(Object.keys(e), []);

  b.add('foo', []);

  t.is(typeof e.foo, 'function');
});

test('builder.add does not allow keys with reserved words', t => {
  const e = new Enumeration({});
  const b = builder(e);

  t.throws(
    () => b.add('caseOf', []),
    TypeError,
    'caseOf is a reserved enum type',
  );
});
