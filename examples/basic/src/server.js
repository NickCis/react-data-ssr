import express from 'express';
import React from 'react';
import routes from './routes';
import { StaticRouter } from 'react-router';
import { matchRoutes, renderRoutes } from 'react-router-config';
import { renderToString } from 'react-dom/server';
import serialize from 'serialize-javascript';
import resolveInitialData from 'react-data-ssr-server';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    const data = {};
    const branches = matchRoutes(routes, req.url);
    const setData = (k, d) => data[k] = d;
    resolveInitialData(branches, setData)
      .then(() => {
      const context = {};
      const markup = renderToString(
        <StaticRouter location={req.url} context={context}>
          {renderRoutes(routes, {
            initialData: data,
            hasLoadedComponent: () => console.trace('Should not call `hasLoadedComponent` in SSR`'),
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
            window.__INITIAL_DATA__ = ${serialize(data)}
          </script>
        </body>
        </html>`
      );
    });
  });

export default server;
