import React from 'react';
import PropTypes from 'prop-types';
import withGetInitialData from 'react-data-ssr';

const Home = ({isLoading, title, body}) => {
  if (isLoading)
    return <span>Loading</span>;
  return (
    <div>
      <h1>{title}</h1>
      <p>{body}</p>
    </div>
  );
};

Home.propTypes = {
  isLoading: PropTypes.bool,
  title: PropTypes.string,
  body: PropTypes.string,
};

const mapArgsToProps = () => ({
});

const generateComponentKey = (Component, props) => 'Home';

const mapDataToProps = ({title, body}) => ({
  title: title,
  body: body,
});

const getInitialData = (props, {setLoading, setData}) => new Promise(rs => {
  setLoading(true);
  setTimeout(() => {
    setData({
      title: 'Home',
      body: 'this is a body',
    });
    rs();
  }, 1000);
});

export default withGetInitialData({
  mapArgsToProps,
  generateComponentKey,
  mapDataToProps,
  getInitialData,
})(Home);
