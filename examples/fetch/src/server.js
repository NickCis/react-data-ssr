import express from 'express';
import React from 'react';
import routes from './routes';
import { StaticRouter } from 'react-router';
import { matchRoutes, renderRoutes } from 'react-router-config';
import { renderToString } from 'react-dom/server';
import serialize from 'serialize-javascript';
import { resolveInitialData } from 'react-data-ssr-server';
import api from './api';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .use('/api', api)
  .get('/*', (req, res) => {
    const branches = matchRoutes(routes, req.url);

    // In order to have the request, we should send it as an extra parameter
    // The component will map it using `mapArgsToProps`
    resolveInitialData(branches, {req})
      .then(({store, errors}) => {
        const context = {};
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

export default server;
