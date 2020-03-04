import test from 'ava';

import enumerize, { Enumeration } from '.';

test('enumerize wraps Enumeration constructor', (t) => {
  const declaration = {
    foo: [],
    bar: [],
  };

  const A = enumerize(declaration);
  const B = new Enumeration(declaration);

  t.deepEqual(A, B);
});
