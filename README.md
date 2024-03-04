# ts-gasrun

Minimalist wrapper for google.script.run with native TypeScript support.

This package promisifies `google.script.run`,
a client-side API of Google Apps Script (GAS)
to call server-side GAS functions from HTML-service pages.
Wrapped GAS functions are typed in TypeScript
with the promisified types of the corresponding GAS functions.
This enables type checks and enhances IDE assists.

## Installation

Using npm:

```shell
npm install ts-gasrun
```

Using yarn:

```shell
yarn add ts-gasrun
```

Using pnpm:

```shell
pnpm add ts-gasrun
```

## How to use

### Preparation for use in Typescript

In the server-side code, export functions to be called from the client-side.

```typescript
// gas-functions.ts: GAS server-side code

export function hello(str: string) {
  return `Hello ${str}!`;
}

export function concat(prop: { a: string; b: unknown }) {
  return { result: prop.a + prop.b };
}

export function throwError() {
  throw new Error("Error in GAS!");
}
```

### Front-end Typescript code

Wrap exported GAS functions in the client-side.

```typescript
// Frontend code bundled into GAS HTML-service pages
import { wrapGASFunctions } from "ts-gasrun";

// Wrap the all functions exported from a module.
import * as GASFuncs from "./gas-functions";
const gasrun = wrapGASFunctions(GASFuncs);

// Wrap specified functions of a module.
import { hello } from "./gas-functions";
const gasrun = wrapGASFunctions({ hello });
```

Then, use the wrapped functions with proper types.

```typescript
// Case of using then & catch
gasrun
  .hello("world") // hello: (str: string) => Promise<string>
  .then((result) => {
    console.log(result);
  });
gasrun.throwError().catch((error) => {
  console.error(error);
});

// Case of using async & await
(async () => {
  const { result } =
    // concat: (prop: { a: string, b: unknown }) => Promise<{ result: string }>
    await gasrun.concat({ a: "string", b: 123 });
  console.log(result);
  try {
    await gasrun.throwError();
  } catch (error) {
    console.error(error);
  }
})();
```

### Client-side in Javascript

You can use this package as an ES module in JavaScript also,
like below in a GAS HTML-service page.

```html
<script type="module">
  import { wrapGASFunctions } from "https://unpkg.com/ts-gasrun";

  // Wrap all functions available within google.script.run
  const gasrun = wrapGASFunctions();
  // Or you can specify wrapping functions:
  const gasrun = wrapGASFunctions({ hello: null, concat: null });

  (async () => {
    const { result } = await gasrun.concat({
      a: await gasrun.hello("world"),
      b: 123,
    });
    document.body.textContent = result;
  })();
</script>
```

### Mocking

You can mock GAS functions for local development.
Use `mockGASFunctions` with mock implementations of GAS functions,
instead of `wrapGASFunctions`.

```typescript
import { wrapGASFunctions, mockGASFunctions } from "ts-gasrun";
import * as GASFuncs from "./gas-functions";

const gasrun =
  process.env.NODE_ENV === "production"
    ? wrapGASFunctions(GASFuncs)
    : mockGASFunctions({
        hello: (str: string) => `Hello, ${str}!`,
        concat: ({ a, b }) => ({ result: `${a}${b}` }),
        throwError: () => {
          throw new Error("Error!");
        },
      });
```

## Acknowledgements

This package is inspired by [gas-client](https://github.com/enuchi/gas-client).
