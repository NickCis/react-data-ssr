import express from 'express';
import React from 'react';
import routes from './routes';
import { StaticRouter } from 'react-router';
import { matchRoutes, renderRoutes } from 'react-router-config';
import { renderToString } from 'react-dom/server';
import serialize from 'serialize-javascript';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();

/**
 * XXX: move this to `react-data-ssr-server`
 * @params {Array} branches - React router config branches o component list
 * @return {Promise} -
 */
function resolveInitialData(branches, setData, ...args) {
  const promises = branches.reduce((acc, b) => {
    const getInitialData = b.route ? b.route.component.getInitialData : b;
    if (getInitialData)
      acc = acc.concat(getInitialData(setData, ...args));
    return acc;
  }, []);
  return Promise.all(promises);
}

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
            hasLoadedComponent: () => {},
            dismissLoadedComponent: () => {},
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
