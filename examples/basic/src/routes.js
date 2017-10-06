import App from './App.js';
import Home from './pages/Home.js';
import List from './pages/List.js';
import NotFound from './pages/NotFound.js';

const routes = [
  {
    component: App,
    routes: [
      {
        component: Home,
        path: '/',
        exact: true,
      },
      {
        component: List,
        path: '/list',
        exact: true,
      },
      {
        component: NotFound,
      }
    ],
  },
];

export default routes;
