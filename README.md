# jsEnumerize

 - **Simple** - No tricks, not complicated code, just plain old javascript.
 - **Consistent** - Enforce checking against the real value.
 - **Correct** - Enum values shouldn't exist outside of your enum.
 - **Modern** - Uses latest javascript language features for a seamless experience.

`jsEnumerize` uses POJOs (plain old javascript objects), and the new [Proxy API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) to create an elegant solution to a common problem.

Many of the currently available javascript enum implementations are complicated, and that's just not necessary.
Some uses classes with getter and setter methods, some just pipe out an object, and all of them don't scope the values to your enum.

## Getting Started

Install from npm or yarn:

<pre>
npm i <a href="https://github.com/mrozbarry/js-enumerizer">js-enumerize</a>
</pre>

Or grab it from a CDN:

```html
<script defer src="https://unpkg.com/js-enumerize"></script>
<script>
  const myEnum = jsEnumerize(['one', 'two', 'three']);
</script>
```

## Usage

```javascript
import { enumerize } from 'js-enumerize';

export const myEnum = jsEnumerize([
  'authenticating',
  'authenticated',
  'unauthenticated',
  'failed',
]);

console.log(myEnum);
/*
  {
    authenticating: Symbol(authenticating),
    authenticated: Symbol(authenticated),
    unauthenticated: Symbol(unauthenticated),
    failed: Symbol(failed)
  }
*/
console.log(myEnum.authenticating === 'authenticating'); // false
console.log(myEnum.authenticating === Symbol('authenticating')); // false;
const test = myEnum.authenticating;
console.log(myEnum.authenticating === test); // true
```
