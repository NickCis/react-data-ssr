import React from 'react';
import { renderRoutes } from 'react-router-config';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './App.css';
import { withGetInitialData } from 'react-data-ssr';
import obtain from './obtain.{target}';

const App = ({ route, hasLoadedComponent, dismissLoadedComponent, getInitialData, links }) => (
  <div>
    <div>React Data SSR example.</div>
    <div>
      <ul>
        { (links || []).map((l, i) =>
          <li key={i}>
            <Link to={l.to}>{l.text}</Link>
          </li>
        ) }
      </ul>
    </div>
    <div>
      {
        renderRoutes(route.routes, {
          hasLoadedComponent,
          dismissLoadedComponent,
          getInitialData,
        })
      }
    </div>
  </div>
);

App.propTypes = {
  route: PropTypes.object.isRequired,
};

const mapDataToProps = ({links}) => ({
  links,
});

const getData = ({req}, {setLoading, setData}) => {
  setLoading(true);
  return obtain('/api/links', {req})
    .then(r => r.json())
    .then(json => setData(json));
};

const mapArgsToProps = (branch, {req}) => ({req});

export default withGetInitialData({
  mapArgsToProps,
  mapDataToProps,
  getData,
})(App);
