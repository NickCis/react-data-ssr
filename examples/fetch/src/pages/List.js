import React from 'react';
import PropTypes from 'prop-types';
import { withGetInitialData } from 'react-data-ssr';
import obtain from '../obtain.{target}';

const List = ({isLoading, list}) => {
  if (isLoading)
    return <span>Loading</span>;
  return (
    <div>
      <h1>List</h1>
      <ul>
        {(list||[]).map((l, i) => <li key={i}>{l}</li>)}
      </ul>
    </div>
  );
};

List.propTypes = {
  isLoading: PropTypes.bool,
  list: PropTypes.array,
}

const mapDataToProps = ({data}) => ({
  list: data,
});

const getData = ({req}, {setLoading, setData}) => {
  setLoading(true);
  return obtain('/api/list', {req})
    .then(r => r.json())
    .then(json => setData(json));
};

const mapArgsToProps = (branch, {req}) => ({req});

export default withGetInitialData({
  mapArgsToProps,
  mapDataToProps,
  getData,
})(List);
