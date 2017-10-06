import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import routes from './routes';

const data = window.__INITIAL_DATA__;
hydrate(
  <BrowserRouter>
    {
      renderRoutes(routes, {
        hasLoadedComponent: k => k in data,
        dismissLoadedComponent: k => delete data[k],
        initialData: data,
      })
    }
  </BrowserRouter>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
