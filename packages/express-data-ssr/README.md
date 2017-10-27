# Express Data SSR

A `fetch` like function to perform local calls to an Express-based router.

The main idea of this package is to have a `fetch` like wrapper in order to use the same logic for client and ssr data fetching.

An easy way in order to provide the regular `fetch` for client and the created `fetch` for SSR is using [Webpack's NormalModuleReplacementPlugin](https://webpack.js.org/plugins/normal-module-replacement-plugin/). See the [`fetch` example](../../examples/fetch)

## Instalation

```bash
yarn -i express-data-ssr-server

# Or using npm
npm -i express-data-ssr-server --save
```

## Examples

The [examples](../../examples) folder contains several exmaples.

---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Usage](#usage)
  - [Simple Example](#simple-example)
- [Api](#api)
  - [`createFetch(router: Router, base: String) => (url: String, options: Object) => Promise)`](#createfetchrouter-router-base-string--url-string-options-object--promise)
    - [`router: Router`](#router-router)
    - [`base: String`](#base-string)
    - [`url: String`](#url-string)
    - [`options: Object`](#options-object)
    - [Returned value (`Promise`)](#returned-value-promise)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Usage

### Simple Example

```js
// router.js
import { Router } from 'express';

const router = new Router();
router.get('/list', (req, res) => {
    res.json([1, 2, 3, 4]);
  });

export default router;

// obtain.js
import { createFetch } from 'express-data-ssr';
import router from './router';

const obtain = createFetch(router, '/api');
export default obtain;

// server.js
import express from 'express;
import router from './router';
import obtain from './obtain';

const server = express();

server
  .use('/api', router)
  .get('/', (req, res) => {
    obtain('/api/list')
      .then(r => r.json())
      .then(json => {
        console.log(json);
        res.json(json);
      });
  });
```

## Api

### `createFetch(router: Router, base: String) => (url: String, options: Object) => Promise)`

This function does all the magic. It creates a `fetch` like function in order to make fetch requests on the passed router.

Although the created function tries to mimic `fetch` api, it has several differences:

- The `options` object needs a `req` key which has to contain the original express's request
- Query params are passed in the `options` object under the key `query`

In order to provide a common api between `fetch` and the created `fetch`. On the client side, `fetch` should be wrapped and the `query` value should be encoded and appended to the url.

There are several libraries in order to encode the query, any could be used (eg: [query-string stringify method](https://www.npmjs.com/package/query-string#stringify-object--options-))

**Note:** The user must serve the regular `fetch` to the client code and the created one to se SSR. An easy way to do it is using [Webpack's NormalModuleReplacementPlugin](https://webpack.js.org/plugins/normal-module-replacement-plugin/). See the [`fetch` example](../../examples/fetch)

#### `router: Router`

An express router, created with `express.Router()`.

#### `base: String`

The base url path of the passed router.

#### `url: String`

The `url` which the request will be simulated. It must include the base path.

**Note:** If this `url` doesn't starts with the base path, the returned promise will be rejected.

#### `options: Object`

A `fetch` option object with the following extra keys:

- `req`: The original express's Request
- `query`: The url query string parsed (in the form of an object).

#### Returned value (`Promise`)

The returned value mimics `fetch`. It returns a promise that resolves to a `Response` object. This object implements the followin properties / methods:

- `ok`: Returns true for `2xx` status codes
- `status`: Returns the status code of the request (defaults to `200` if it wasn't set)
- `json`: Returns a promise that resolves to the setted json
- `type`: Always return a string with the value `SSR`
