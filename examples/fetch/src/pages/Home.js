import React from 'react';
import PropTypes from 'prop-types';
import { withGetInitialData } from 'react-data-ssr';
import obtain from '../obtain.{target}';

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

const mapDataToProps = ({title, body}) => ({
  title: title,
  body: body,
});

const getData = ({req}, {setLoading, setData}) => {
  setLoading(true);
  return obtain('/api/home', {req})
    .then(r => r.json())
    .then(json => setData(json));
};

const mapArgsToProps = (branch, {req}) => ({req});

export default withGetInitialData({
  mapArgsToProps,
  mapDataToProps,
  getData,
})(Home);
