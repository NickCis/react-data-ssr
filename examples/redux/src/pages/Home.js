import React from 'react';
import PropTypes from 'prop-types';
import { connectWithGetInitialData } from 'redux-data-ssr';
import { getHome } from '../actions';

const Home = ({loading, title, body}) => {
  if (loading)
    return <span>Loading</span>;
  return (
    <div>
      <h1>{title}</h1>
      <p>{body}</p>
    </div>
  );
};

Home.propTypes = {
  loading: PropTypes.bool,
  title: PropTypes.string,
  body: PropTypes.string,
};

const mapStateToProps = state => ({
  loading: state.home.loading,
  title: state.home.title,
  body: state.home.body,
});

const mapDispatchToProps = dispatch => ({
  getHome: () => dispatch(getHome()),
});

const getData = ({ getHome }) => getHome();

export default connectWithGetInitialData({getData})(mapStateToProps, mapDispatchToProps)(Home);
