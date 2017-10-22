import express from 'express';
import React from 'react';
import routes from './routes';
import { StaticRouter } from 'react-router';
import { matchRoutes, renderRoutes } from 'react-router-config';
import { renderToString } from 'react-dom/server';
import serialize from 'serialize-javascript';
import { resolveInitialData } from 'react-data-ssr-server';
import { Provider } from 'react-redux';
import configureStore from './store';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    // Setup store configuration
    const store = configureStore();
    const dispatch = act => store.dispatch(act);
    const getState = () => store.getState();

    const branches = matchRoutes(routes, req.url);

    // Pass dispatch and getState functions as extra
    resolveInitialData(branches, { dispatch, getState })
      .then(({errors}) => {
        const context = {};
        const markup = renderToString(
          <Provider store={store}>
            <StaticRouter location={req.url} context={context}>
              {renderRoutes(routes)}
            </StaticRouter>
          </Provider>
        );

        // Grab the initial state from our Redux store
        const finalState = store.getState();

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
              window.__PRELOADED_STATE__ = ${serialize(finalState)}
            </script>
          </body>
          </html>`
        );
      });
  });

export default server;
