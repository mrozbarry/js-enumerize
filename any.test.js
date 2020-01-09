const { Any } = require('./any');
const test = require('ava');

test('Any can construct any value in a non enumerable key', t => {
  const a = new Any(123);

  t.is(a.toString(), '123');
  t.is(a.valueOf(), 123);
  t.deepEqual(Object.keys(a), []);
});
