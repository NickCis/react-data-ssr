import React from 'react';
import { renderRoutes } from 'react-router-config';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './App.css';
import { connectWithGetInitialData } from 'redux-data-ssr';
import { getLinks } from './actions';

const App = ({ route, links }) => (
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
      { renderRoutes(route.routes) }
    </div>
  </div>
);

App.propTypes = {
  route: PropTypes.object.isRequired,
};

const getData = ({getLinks}) => getLinks();

const mapStateToProps = state => ({
  links: state.links.links,
});

const mapDispatchToProps = dispatch => ({
  getLinks: () => dispatch(getLinks()),
});

export default connectWithGetInitialData({getData})(mapStateToProps, mapDispatchToProps)(App);
