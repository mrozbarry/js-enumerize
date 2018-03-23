const { enumerize, Enumeration } = require('.');
const test = require('ava');

test('enumerize throws when given non-arrays', ava => {
  const nonArray = [
    'test',
    123,
    {},
    Symbol('foo'),
    false,
    undefined,
    null,
  ];

  ava.plan(nonArray.length);

  nonArray.forEach((v) => {
    ava.throws(() => enumerize(v), Error, `Was able to set ${JSON.stringify(v)}`);
  });
});

test('enumerize throws when given an array of empty/non-strings', ava => {
  const arraysOfNonStrings = [
    [1, 2],
    [{}, {}],
    [[], []],
    [Symbol('test')],
    [true, false],
    [''],
  ];

  ava.plan(arraysOfNonStrings.length);

  arraysOfNonStrings.forEach((v) => {
    ava.throws(() => enumerize(v), Error, `Was able to set ${JSON.stringify(v)}`);
  });
});

test('an enumerized object cannot be modified', ava => {
  const e = enumerize(['a', 'b']);

  ava.plan(2);
  ava.throws(() => e.a = 'test', Error, 'Cannot override old value');
  ava.throws(() => e.c = 'test', Error, 'Cannot add new key/value');
});

test('enumerize succeeds when given an empty array', ava => {
  const e = enumerize([]);
  ava.pass();
});

test('enumerize succeeds when given an array of strings', ava => {
  const e = enumerize(['bar', 'foo']);
  ava.deepEqual(Object.keys(e).sort(), ['bar', 'foo']);
});

test('enumerize sets all values as symbols', ava => {
  const e = enumerize(['bar', 'foo']);

  ava.plan(2);
  Object.values(e).forEach(s => ava.truthy(typeof s === 'symbol'));
});

test('enumerize .toString() returns Enumeration { ...keys }', ava => {
  const e = enumerize(['bar', 'foo']);
  ava.is(e.toString(), 'Enumeration { bar, foo }');
});

test('enumeration .valueOf() returns [Symbol(key1), ...]', ava => {
  const e = enumerize(['bar', 'foo']);
  ava.deepEqual(e.valueOf(), [e.bar, e.foo]);
});

test('enumerize() returns an instance of Enumeration', ava => {
  const e = enumerize(['bar', 'foo']);
  ava.truthy(e instanceof Enumeration);
})
