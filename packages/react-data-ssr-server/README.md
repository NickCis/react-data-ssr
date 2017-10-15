# React Data SSR

Server side initial data resolution for react-data-ssr.

## Instalation

```bash
yarn -i react-data-ssr-server

# Or using npm
npm -i react-data-ssr-server --save
```

## Examples

The [examples](../../examples) folder contains several exmaples.

---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Usage](#usage)
  - [Simple Example](#simple-example)
- [Api](#api)
  - [`resolveInitialData(branches, extra) -> Promise`](#resolveinitialdatabranches-extra---promise)
    - [`branches`](#branches)
    - [`extra`](#extra)
    - [Returned value (`Promise`)](#returned-value-promise)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Usage

### Simple Example

```js
// server.js
import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { resolveInitialData } from 'react-data-ssr';
import { matchRoutes, renderRoutes } from 'react-router-config';
import { StaticRouter } from 'react-router';
import routes from './routes'; // React Router Config Routes
import serialize from 'serialize-javascript';

const server = express();
server
  .get('/*', (req, res) => {
    // Get all the branches
    const branches = matchRoutes(routes, req.url);

    // Resolve the data required by each branch
    resolveInitialData(branches)
      .then(({store, errors}) => {
        // We'll ignore errors

        const context = {};

        // Render the markup
        const markup = renderToString(
          <StaticRouter location={req.url} context={context}>
            {renderRoutes(routes, {
              getInitialData: k => store[k],
              hasLoadedComponent: k => k in store,
              dismissLoadedComponent: () => console.trace('Should not call `dismissLoadedComponent` in SSR`'),
            })}
          </StaticRouter>
        );

        res.send(
          `<!doctype html>
          <html lang="">
          <head>
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta charSet='utf-8' />
            <title>React Data SSR example</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            ${assets.client.css
              ? `<link rel="stylesheet" href="${assets.client.css}">`
              : ''}
             ${process.env.NODE_ENV === 'production'
               ? `<script src="${assets.client.js}" defer></script>`
               : `<script src="${assets.client.js}" defer crossorigin></script>`}
          </head>
          <body>
            <div id="root">${markup}</div>
            <script>
              window.__INITIAL_DATA__ = ${serialize(store)}
            </script>
          </body>
          </html>`
        );
      });
  });
```

**Note:** The example uses _React 16_, but it's not a requeriment. _React 15_ could alse be used.
**Note 2:** The example uses _React Router Config_, but it's not a requeriment. Any route configuration could be used.

## Api

### `resolveInitialData(branches, extra) -> Promise`

Resolves all data, calling the static method `getInitialData` of each branch's component.

#### `branches`

List with branches. This function support 3 types of branches:

- React Router Config: What is returned by the `matchRoutes` function. Eg:

```js
{
  route: {
    component: Component,
    routes: []
  },
  match: {
    path: '',
    url: '',
    params: {},
    isExact:
  }
}
```

- Dictionary: A dictionary with a key `component` that contains the react component. Eg:

```js
{
  component: Component,
  // ...
}
```

- Component: Just the React Component.

**Note:** Remember that the branch will be passed as an argument to the static method `getInitialData`. By using the [`mapArgsToProps`](../react-data-ssr#mapargstoprops-branch-object-extra-object--object-optional) this args can be mapped to the required props for the [`getData`](../react-data-ssr#getdata-props-object-bag-object--promise).

#### `extra`

This is an extra, optional argument that will be passed to `getInitialData`. It can be used in the [`mapArgsToProps`](../react-data-ssr#mapargstoprops-branch-object-extra-object--object-optional) to map properties [`getData`](../react-data-ssr#getdata-props-object-bag-object--promise).

#### Returned value (`Promise`)

The function returns a _Promise_ that will be resolved when all the `getInitialData` promises resolve.

In the resolution, this promise sends an Object with two keys:

- `store`: A dictionary that relates successful `getInitialData`'s promises (by the Component's Key) with the resolved data.
- `errors`: A dictionary that relates the rejected `getInitialData`'s promises (by the Component's key) with the failed data.

**Note:** This promise will never reject
