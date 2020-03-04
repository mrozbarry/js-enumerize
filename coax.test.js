import test from 'ava';

import { coax } from './coax';

class DateString {
  constructor(iso8601) {
    this.toString = () => iso8601;
  }

  toDate() {
    return new Date(this.toString());
  }
}

const CoaxedDateString = coax(DateString, (input) => (new Date(input)).toISOString());

test('coax returns a new constructor function', (t) => {
  t.not(DateString, CoaxedDateString);
});

test('a coaxed class will create the correct type', (t) => {
  const d = CoaxedDateString('2020-01-01 12:00:00');
  t.truthy(d instanceof DateString);
});
