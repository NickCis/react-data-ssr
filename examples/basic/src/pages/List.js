import React from 'react';
import PropTypes from 'prop-types';
import withGetInitialData from 'react-data-ssr';

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

const mapArgsToProps = () => ({
});

const generateComponentKey = (Component, props) => 'List';

const mapDataToProps = ({data}) => ({
  list: data,
});

const getInitialData = (props, {setLoading, setData}) => new Promise(rs => {
  setLoading(true);
  setTimeout(() => {
    setData({
      data: [
        'first',
        'second',
        'thrid',
      ]
    });
    rs();
  }, 1000);
});

export default withGetInitialData({
  mapArgsToProps,
  generateComponentKey,
  mapDataToProps,
  getInitialData,
})(List);
