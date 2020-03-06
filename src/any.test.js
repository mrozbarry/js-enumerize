import test from 'ava';
import Any from './any';

test('Can construct an Any type', (t) => {
  t.notThrows(() => new Any());
});
