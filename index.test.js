const enumerize = require('.');
const { Enumeration } = enumerize;

const test = require('ava');

test('enumerize wraps Enumeration constructo', t => {
  const declaration = {
    foo: [],
    bar: [],
  };

  const A = enumerize(declaration);
  const B = new Enumeration(declaration);

  t.deepEqual(A, B);
});
