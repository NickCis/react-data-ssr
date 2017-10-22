import React from 'react';
import PropTypes from 'prop-types';
import { connectWithGetInitialData } from 'redux-data-ssr';
import { getList } from '../actions';

const List = ({loading, list}) => {
  if (loading)
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
  loading: PropTypes.bool,
  list: PropTypes.array,
}

const mapStateToProps = state => ({
  list: state.list.list,
  loading: state.list.loading,
});

const mapDispatchToProps = dispatch => ({
  getList: () => dispatch(getList()),
});

const getData = ({ getList }) => getList();

export default connectWithGetInitialData({getData})(mapStateToProps, mapDispatchToProps)(List);
