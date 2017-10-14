import React from 'react';
import { renderRoutes } from 'react-router-config';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './App.css';
import { withGetInitialData } from 'react-data-ssr';

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

const getData = (props, {setLoading, setData}) => new Promise(rs => {
  setLoading(true);
  setTimeout(() => {
    setData({
      links: [
        { to: '/', text: 'Home' },
        { to: '/list', text: 'List' },
      ]
    });
    rs();
  }, 1000);
});

export default withGetInitialData({
  mapDataToProps,
  getData,
})(App);
