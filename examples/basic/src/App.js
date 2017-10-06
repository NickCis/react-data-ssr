import React from 'react';
import { renderRoutes } from 'react-router-config';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './App.css';

const App = ({ route, hasLoadedComponent, dismissLoadedComponent, initialData }) => (
  <div>
    <div>React Data SSR example.</div>
    <div>
      <ul>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/list'>List</Link></li>
      </ul>
    </div>
    <div>
      {
        renderRoutes(route.routes, {
          hasLoadedComponent,
          dismissLoadedComponent,
          initialData,
        })
      }
    </div>
  </div>
);

App.propTypes = {
  route: PropTypes.object.isRequired,
};

export default App;
