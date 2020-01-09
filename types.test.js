const { Any } = require('./any');
const { toType, typeCheck } = require('./types');
const test = require('ava');

test('toType casts to the specified type', t => {
  t.deepEqual(toType('foo', Array), ['f', 'o', 'o']);
  t.truthy(isNaN(toType('foo', Number)));
  t.deepEqual(
    toType('2020-01-01T00:00:00.000Z', Date),
    new Date('2020-01-01T00:00:00.000Z'),
  );
});

test('typeCheck can check if a value is an instance of a type, using a constructor function', (t) => {
  class Custom {}
  const v = new Custom();

  t.truthy(typeCheck(v, Custom));
});

test('typeCheck always returns true for an Anything type', (t) => {
  class Custom {}

  t.truthy(typeCheck(1, Any));
  t.truthy(typeCheck('foo', Any));
  t.truthy(typeCheck(false, Any));
  t.truthy(typeCheck(new Custom(), Any));
});

test('typeCheck uses an internal primitive lookup table to map non-constructed values like strings, numbers, booleans, and inlined arrays', (t) => {
  t.truthy(typeCheck(1, Number));
  t.truthy(typeCheck('foo', String));
  t.truthy(typeCheck(false, Boolean));
  t.truthy(typeCheck([], Array));
});
