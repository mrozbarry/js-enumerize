import test from 'ava';
import enumerize from './enumerize';
import Any from './any';

const Maybe = enumerize({
  just: [Any],
  nothing: [],
}, 'Maybe');

test('creates an enumeration with methods', (t) => {
  t.is(Maybe.just('foo') instanceof Maybe, true);
  t.is(Maybe.nothing() instanceof Maybe, true);
  t.is(Maybe.name, 'Maybe');
});

test('Enumerize.toString outputs a string representation of the enumeration', (t) => {
  t.is(Maybe.toString(), 'Maybe<just|nothing>');
});

test('enum instances do not cross boundaries', (t) => {
  const OtherEnumUnion = enumerize({
    nothing: [],
  }, 'Empty');

  t.is(Maybe.nothing() instanceof OtherEnumUnion, false);
});

test('cannot set an unexpected type', (t) => {
  const ExplicitTypes = enumerize({
    string: [String],
    number: [Number],
    bool: [Boolean],
  }, 'ExplicitTypes');

  t.throws(
    () => ExplicitTypes.string(false),
    'ExplicitTypes.string(<String>) expects argument#0 to be a String, but it was a boolean',
  );
  t.throws(
    () => ExplicitTypes.number('foo'),
    'ExplicitTypes.number(<Number>) expects argument#0 to be a Number, but it was a string',
  );
  t.throws(
    () => ExplicitTypes.bool(100),
    'ExplicitTypes.bool(<Boolean>) expects argument#0 to be a Boolean, but it was a number',
  );
});

test('can nest enumerized types', (t) => {
  const WithMaybe = enumerize({
    foo: [Maybe, String],
  }, 'WithMaybe');

  t.notThrows(() => WithMaybe.foo(Maybe.just('test'), 'foo'));
  t.throws(
    () => WithMaybe.foo(123, 'foo'),
    `WithMaybe.foo(Maybe<just|nothing>, <String>) expects argument#0 to be a ${Maybe.name}, but it was a number`,
  );
});

test('can run caseof against values', (t) => {
  const testCaseOf = (input) => Maybe.caseOf({
    just: (value) => `just/${value}`,
    nothing: (value) => `nothing/${value}`,
  }, input);

  t.is(testCaseOf(Maybe.just('foo')), 'just/foo');
  t.is(testCaseOf(Maybe.nothing()), 'nothing/undefined');
});

test('can throw a meaningful error when there is an invalid key', (t) => {
  t.throws(
    () => Maybe.caseOf({ just: () => null, foo: () => null }),
    "The key(s) foo in your caseOf do not match Maybe<just|nothing>'s types",
  );
});

test('can throw a meaningful error when there is a missing key', (t) => {
  t.throws(
    () => Maybe.caseOf({ just: () => null }),
    'You are missing some keys in your Maybe<just|nothing>.caseOf call, did you forget to add a key or use _?',
  );
});

test('caseOf throws if the value is not an instance of the enumeration being checked', (t) => {
  const Foo = enumerize({ foo: [] }, 'Foo');
  t.throws(
    () => Foo.caseOf({ _: () => null }, 'bad value'),
    'bad value is not an instance of Foo<foo>',
  );
});

test('caseOf throws an error if there is no _ fallthrough', (t) => {
  t.throws(
    () => Maybe.caseOf({ nothing: () => null }, Maybe.just('foo')),
    'You are missing some keys in your Maybe<just|nothing>.caseOf call, did you forget to add a key or use _?',
  );
});

test('enumerize sets the name to Enumeration by default', (t) => {
  const Test = enumerize({ foo: [] });
  t.is(Test.name, 'Enumeration');
});

test('caseOf falls through to _', (t) => {
  t.is(
    Maybe.caseOf({ nothing: () => 'nothing', _: () => 'something' }, Maybe.just('foo')),
    'something',
  );
});
