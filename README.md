# jsEnumerize

 - **Simple** - No tricks, not complicated code, just plain old javascript.
 - **Consistent** - Enforce checking against the real value.
 - **Correct** - Enum values shouldn't exist outside of your enum.
 - **Modern** - Uses latest javascript language features for a seamless experience.

An important note: all of the type checking is implemented at runtime, and that can be a problem.
If you are already using it, TypeScript offers compile-time typing which will be much more efficient for your code.

## Getting Started

Install from npm or yarn:

<pre>
npm i --save <a href="https://github.com/mrozbarry/js-enumerizer">@mrbarrysoftware/js-enumerize</a>
</pre>

## What sort of enumeration is this?

This is some sort of union enumeration type, made popular from languages like Elm and Haskell.

First and foremost, this is just a type that has an affinity to a set of constants.
For instance, you could write a simple boolean enumeration like this: `const bool = enumerize({ true: [], false: [] })`
To use the bool enum type, `bool` exposes methods for each item passed into `jsEnumerize`.
In this case, we have `bool.true()` and `bool.false()`.

Second, each enumeration supports pattern matching. This makes it easy to handle the various ways the enum can be used in one handy function.
For instance, using the above bool type, let's say we want to print something on the screen based on whether or not the bool value is true:
`const returnedString = bool.caseOf({ true: () => 'The value is true', false: () => 'The value is false' }, bool.true());`

## Usage

### Import it

```js
// es6/babel
import enumerize, { Any } from 'js-enumerize';

// from unpkg
import enumerize, { Any } from 'https://unpkg.com/@mrbarrysoftware/js-enumerize?module=1';

// from script tag
// <script src="https://unpkg.com/@mrbarrysoftware/js-enumerize"></script>
const { enumerize } = window;
const { Any } = enumerize;

// node
const enumerize = require('js-enumerize');
const { Any } = enumerize;
```

### Simple

Let's make a simple enum type, [Maybe](https://en.wikipedia.org/wiki/Option_type#Haskell), which can have a value, or have nothing.

```js
const Maybe = enumerize({
  just: [Any],
  nothing: [],
});

const greet = value => Maybe.caseOf({
  just: name => `Hello ${name}`,
  nothing: () => `Nice to meet you, what's your name?`,
}, value);

console.log(greet(Maybe.just('mrozbarry'))); // Hello mrozbarry
console.log(greet(Maybe.nothing()));         // Nice to meet you, what's your name
```

In our case, we are saying that when our `Maybe` has a value, it has to be a singular `Any` value.
This could be more specific, like `String`, a custom class you've made, or multiple type constructors.

`Maybe.caseOf` allows us to extract the values we store.
For a `Maybe`, we can either extract the `just` value, or handle the case when we don't have data.

> **Important:**
> `YourEnumType.caseOf` of any enumeration **must** account for all cases.
This means each type key you declare, like `just` and `nothing`, must exist as keys in your `.caseOf` call.

### Real-life Use Case

What if we want to track the progress of an action, and return the result of that at the end?
Here's a progress enum type, and how we could render that with a JSX function component:

```js
const Progress = enumerize({
  incomplete: [],
  partial: [Number, Number],
  complete: [Any],
  error: [Error],
});

const SomeComponent = ({ progress }) => Progress.caseOf({
  incomplete: () => (
    <section>
      <PendingIcon />
      <ProgressBar percent={0} />
    </section>
  ),
  partial: (current, total) => (
    <section>
      <ActiveIcon />
      <ProgressBar percent={current / total} />
    </section>
  ),
  complete: (resultingThing) => (
    <section>
      <CheckIcon />
      <DisplayThing thing={resultingThing} />
    </section>
  ),
  error: (error) => (
    <section>
      <Error message={error.toString()} />
    </section>
  ),
}, progress);
```

### Skipping `.caseOf` keys

There are a number of cases we may encounter where we don't need to examine all the cases when extracting data.

```js
const Base64Image = enumerize({
  incomplete: [],
  pending: [Number, Number],
  complete: [String],
});

const DisplayImage = ({ image }) => Base64Image({
  complete: src => <img src={src} />,
  _: () => null,
});
```

The `_`, in this case, is a default matcher.
We don't care about how complete the image is, we just want to display it.
If it's complete, we can use an image tag, and if it's incomplete, for any reason, don't show anything.

> **Important:**
> The `_` fallback matcher does not accept any parameters.
This is because any of the unmatched types may have incompatible parameters - there wouldn't be any reasonable way to know which parameters are available.

## API

---
### enumerize(definition[, name]) : Enumeration

#### definition

An object with the following shape descriptor:

```js
{
  nameOfUnionType: [String, Number, ...otherTypes],
  otherType: [Boolean, Object, Function],
}
```

Each key is a union type in this enumeration. For instance, if we were to make a boolean, the two keys would likely be `true` and `false`.
Each key must have an array of types that it takes as arguments. This array can be empty, contain built-in types, custom classes, or other `enumerized()` types.

#### name

A string name to assign the enumerization. This is handy for debugging, but it defaults to `'Enumeration'`.

#### Return value

Returns an Enumeration class

---
### class Enumeration

#### static method Enumeration.toString() : String

A string representation of an enumeration.
Will take the form of `Maybe<just|nothing>`.

#### static method Enumeration.caseOf(objectOfUnionsAndUnderscore, valueFromEnumeration) : Any

A method that acts like a decode/switch statement of the various union types of an enumeration.
It returns whatever value is returned from a case.
Using the maybe type as an example, a caseOf could be built like:

```js
const greet = maybeName => Maybe.caseOf({
  just: name => `Hello ${name}`,
  nothing: () => 'Hey stranger',
}, maybeName);

console.log(greet(Maybe.just('Alex'))); // Hello Alex
console.log(greet(Maybe.nothing()));    // Hey stranger
```

`caseOf` **must** contain all union types of an enumeration, but this rule can be side-stepped by using the `_` key.
The `_` is a default type fall-through, but it comes at a price where you cannot read the params encoded in it.
Here's how the above example could work with a default fall-through:

```js
const greet = maybeName => Maybe.caseOf({
  nothing: () => 'Hey stranger',
  _: () => `Hello friend`,
}, maybeName);

console.log(greet(Maybe.just('Alex'))); // Hello friend
console.log(greet(Maybe.nothing()));    // Hey stranger
```

#### dynamic static method <type>(...params) : Enumeration instance

When you create an `enumerization` with union types, each type gets a function, where params must align with it's types.
If the params don't match their respective type, an error will be thrown.
For instance:

```js
const MyType = enumerize({
  foo: [String, Number],
  bar: [Boolean],
}, 'MyType');

console.log(MyType.foo('hello', 42)) // Outputs MyType<foo>(String, Number)
console.log(MyType.bar(true)) // Outputs MyType<bar>(Boolean)
console.log(MyType.foo({}, false)) // Throws a TypeError
```
