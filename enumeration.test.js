import test from 'ava';

import { Enumeration } from './enumeration';

test('.constructor has a default empty object argument', (t) => {
  t.notThrows(() => new Enumeration());
});

test('.constructor creates empty typed items', (t) => {
  const Enum = new Enumeration({
    foo: [],
    bar: [],
  });

  t.is(typeof Enum.foo, 'function');
  t.is(typeof Enum.bar, 'function');
  t.is(typeof Enum.caseOf, 'function');
  t.is(Enum.toString(), 'Enumeration { foo<>, bar<> }');
});

test('.constructor can declare type dependencies', (t) => {
  const Enum = new Enumeration({
    foo: [Date],
  });

  t.throws(() => Enum.foo());
  t.notThrows(() => Enum.foo(new Date()));
});

test('#valueOf stores a copy of the original declaration', (t) => {
  const declaration = {
    test: [String, Boolean],
  };
  const Enum = new Enumeration(declaration);

  t.deepEqual(Enum.valueOf(), declaration);
});

test('#caseOf matches against the correct key', (t) => {
  t.plan(1);

  const Enum = new Enumeration({
    foo: [String],
    bar: [Number],
  });

  Enum.caseOf({
    foo: (v) => t.is(v, 'test'),
    bar: () => t.fail(),
  }, Enum.foo('test'));
});

test('#caseOf matches against the fallback key with no params passed', (t) => {
  t.plan(1);

  const Enum = new Enumeration({
    foo: [String],
    bar: [Number],
  });

  Enum.caseOf({
    foo: () => t.fail(),
    _: (param) => t.is(param, undefined),
  }, Enum.bar(123));
});

test('#caseOf throws if there are missing cases of the enumeration', (t) => {
  const Enum = new Enumeration({
    foo: [String],
    bar: [Number],
  });

  t.throws(
    () => Enum.caseOf({}, Enum.foo('test')),
    SyntaxError,
    'Enumeration caseOf must either match all keys (foo, bar), or add `_:() => {}` as a default fall-through',
  );
});

test('#toString provides a serialized string of the enumeration', (t) => {
  const Enum = new Enumeration({
    foo: [String],
    bar: [Number],
  });

  t.is(Enum.toString(), 'Enumeration { foo<String>, bar<Number> }');
});
