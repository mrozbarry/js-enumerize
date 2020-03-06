# jsEnumerize

 - **Simple** - No tricks, not complicated code, just plain old javascript.
 - **Consistent** - Enforce checking against the real value.
 - **Correct** - Enum values shouldn't exist outside of your enum.
 - **Modern** - Uses latest javascript language features for a seamless experience.

## Table of Contents

 - [Getting Started](#getting-started)
 - [Usage](#usage)
 - [API](#api)
 - [Other Important Stuff](#other-important-stuff)

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
If you want to skip cases, use the `_` fall-through.

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

## API

### enumerize(definition[, name]) : [class Enumeration](#class-enumeration)
---

Create a new enumeration.

#### Parameters

##### definition (required)

An object with the following shape descriptor:

```js
{
  nameOfUnionType: [String, Number, ...otherTypes],
  otherType: [Boolean, Object, Function],
}
```

Each key is a union type in this enumeration.
For instance, if we were to make a boolean, the two keys would likely be `true` and `false`.
Each key must have an array of type constructors.
This array can be empty, contain built-in types, custom classes, or other `enumerized()` types.

##### name (optional)

A string name to assign the enumerization.
This is handy for debugging using the two `toString()` methods off [Enumeration](#class-enumeration).
It defaults to `'Enumeration'`.

#### Return value

Returns a unique Enumeration class.

#### Notes

_None_

#### Example

```js
const MyEnumUnion = enumerize({
  foo: [String, Boolean],
  bar: [Function],
  baz: [],
}, 'MyEnumUnion');
```

### class Enumeration
---

A class representing a enumerated union type.
Each instance is a union value of this type.

### Enumeration.toString() : String

A string representation of an enumeration.

#### Parameters

_None_

#### Return Value

Will take the form of `Maybe<just|nothing>`.

#### Notes

_None_

#### Example

```js
const MyEnumUnion = enumerize({
  foo: [String, Boolean],
  bar: [Function],
  baz: [],
}, 'MyEnumUnion');

console.log(MyEnumUnion.toString()) // Output: MyEnumUnion<foo|bar|baz>
```

### Enumeration.caseOf(objectOfDefinitionKeys, enumerationValue) : Any

A method that acts like a decode/switch statement of the various union types of an enumeration.
Given a value generated from your enumeration, it will call the supplied keyed function in `objectOfDefinitionKeys` and return that value.

#### Parameters

##### objectOfDefinitionKeys (required)

An object taking a shape similar to the definition in a union.
Instead of arrays with constructors as values, the values should be functions that accept the ordered parameters reflected in the definition.
These functions can return a value that is piped to the return value of the `caseOf` function.
All keys from the definition are required to be present, but it is possible to create a fall-through using the `_` key.

##### valueFromEnumeration (required)

A value generated from your enumeration.
This will typically take the form of `YourEnumUnion.someType(...parameters)`.
The types of your parameters **must** match the expected type constructors given to your `enumerize` call.

#### Return Value

The value returned from the appropriate keyed function.

#### Notes

This function will throw under the following conditions:

 - If you have missing definition keys and do not supply a `_`.
 - If you have definition keys that do not exist in the original `enumerize` definition.
 - If you pass a value that is not of the same enumeration type.

#### Example

Using all definition keys:

```js
const greet = maybeName => Maybe.caseOf({
  just: name => `Hello ${name}`,
  nothing: () => 'Hey stranger',
}, maybeName);

console.log(greet(Maybe.just('Alex'))); // Hello Alex
console.log(greet(Maybe.nothing()));    // Hey stranger
```

Using a `_` fall-through:

```js
const greet = maybeName => Maybe.caseOf({
  nothing: () => 'Hey stranger',
  _: () => `Hello friend`,
}, maybeName);

console.log(greet(Maybe.just('Alex'))); // Hello friend
console.log(greet(Maybe.nothing()));    // Hey stranger
```

### Enumeration.{{type}}(...params) : Enumeration instance

When you create an `enumerization` with union types, each type gets a function to create that union type.

#### Parameters

A dynamic list of parameters that must match the constructor types provided in your `enumerize` definition.

#### Return value

An instance of your enumeration.

#### Notes

If the params don't match their respective type, an error will be thrown.

#### Example

```js
const MyType = enumerize({
  foo: [String, Number],
  bar: [Boolean],
}, 'MyType');

console.log(MyType.foo('hello', 42)); // Outputs: MyType.foo(hello, 42)
console.log(MyType.bar(true));        // Outputs: MyType.bar(true)
console.log(MyType.foo({}, false));   // Throws a TypeError

const isInstanceOfMyType = MyType.foo('hello', 42) instanceof MyType;
console.log(isInstanceOfMyType);      // Outputs: true
```

### Enumeration#toString() : String

Output the type and values of an Enumeration instance.

#### Parameters

_None_

#### Return value

Returns a string representation of your enumeration value.

#### Notes

_None_

#### Example

```js
const MyType = enumerize({
  foo: [String, Number],
  bar: [Boolean],
}, 'MyType');

const value = MyType.foo('hello', 42);
console.log(value.toString()); // Outputs: MyType.foo(hello, 42)
```

### Enumeration#toTypeString() : String

Output the type and parameter types of an enumeration instance.

#### Parameters

_None_

#### Return value

A string representation of your enumeration type's parameter types.

#### Notes

_None_

#### Examples

```js
const MyType = enumerize({
  foo: [String, Number],
  bar: [Boolean],
}, 'MyType');

const value = MyType.foo('hello', 42);
console.log(value.toTypeString()); // Outputs: MyType.foo(<String>, <Number>)
```

## Other Important Stuff

 - Check out the license [here](./LICENSE.md)
 - And other cool stuff [here](https://mrbarry.com)
