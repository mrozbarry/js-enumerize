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
import enumerize, { Any, coax } from 'js-enumerize';

// from unpkg
import enumerize, { Any, coax } from 'https://unpkg.com/@mrbarrysoftware/js-enumerize?module=1';

// from script tag
// <script src="https://unpkg.com/@mrbarrysoftware/js-enumerize"></script>
const { enumerize } = window;
const { Any, coax } = enumerize;

// node
const enumerize = require('js-enumerize');
const { Any, coax } = enumerize;
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
