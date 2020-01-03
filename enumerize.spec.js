const { enumerize, Enumeration } = require('.');
const test = require('ava');

test('enumerize throws when given non-arrays', t => {
  const nonArray = [
    'test',
    123,
    {},
    Symbol('foo'),
    false,
    undefined,
    null,
  ];

  t.plan(nonArray.length);

  nonArray.forEach((v) => {
    t.throws(() => enumerize(v), Error, `Was able to set ${JSON.stringify(v)}`);
  });
});

test('enumerize throws when given an array of empty/non-strings', t => {
  const arraysOfNonStrings = [
    [1, 2],
    [{}, {}],
    [[], []],
    [Symbol('test')],
    [true, false],
    [''],
  ];

  t.plan(arraysOfNonStrings.length);

  arraysOfNonStrings.forEach((v) => {
    t.throws(() => enumerize(v), Error, `Was able to set ${JSON.stringify(v)}`);
  });
});

test('an enumerized object cannot be modified', t => {
  const e = enumerize(['a', 'b']);

  t.plan(2);
  t.throws(() => e.a = 'test', Error, 'Cannot override old value');
  t.throws(() => e.c = 'test', Error, 'Cannot add new key/value');
});

test('enumerize succeeds when given an empty array', t => {
  const e = enumerize([]);
  t.truthy(e);
});

test('enumerize succeeds when given an array of strings', t => {
  const e = enumerize(['bar', 'foo']);
  t.deepEqual(Object.keys(e).sort(), ['bar', 'foo']);
});

test('enumerize sets all values as symbols', t => {
  const e = enumerize(['bar', 'foo']);

  t.plan(2);
  Object.values(e).forEach(s => t.truthy(typeof s === 'symbol'));
});

test('enumerize .toString() returns Enumeration { ...keys }', t => {
  const e = enumerize(['bar', 'foo']);
  t.is(e.toString(), 'Enumeration { bar, foo }');
});

test('enumeration .valueOf() returns [Symbol(key1), ...]', t => {
  const e = enumerize(['bar', 'foo']);
  t.deepEqual(e.valueOf(), [e.bar, e.foo]);
});

test('enumerize() returns an instance of Enumeration', t => {
  const e = enumerize(['bar', 'foo']);
  t.truthy(e instanceof Enumeration);
})
