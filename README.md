# ensureBluebird

Ensure that all returned promises are [`bluebird`](https://www.npmjs.com/package/bluebird) Promises.

## Usage

On whole objects

```js
const ensureBluebird = require("ensure-bluebird")
// ensure all top-level methods return bluebird Promises (if they are returning any promise)
const fse = ensureBluebird(require("fs-extra"))
```

Or on individual functions

```js
const ensureBluebird = require("ensure-bluebird")
const copy = ensureBluebird(require("fs-extra").copy)
```

If the function doesn't return a promise previously, it won't return a promise afterwards. Also static properties are not affected by applying ensureBluebird.
