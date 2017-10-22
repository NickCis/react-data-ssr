# Redux Data SSR

This package provides a High Order Component to make SSR and data fetching painless. It's a wrapper of [_React Data SSR_]('../react-data-ssr/) with Redux bindings.

## Instalation

```bash
yarn -i redux-data-ssr

# Or using npm
npm -i redux-data-ssr --save
```

**Note:** You'll also had to add the redux / react dependencies.

## Examples

The [examples](../../examples) folder contains several exmaples.

---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Usage](#usage)
  - [Simple Example](#simple-example)
- [Api](#api)
  - [`connectWithGetInitialData(options) => (mapStateToProps, mapDispatchToProps) => (ReactComponent) => ReactComponent`](#connectwithgetinitialdataoptions--mapstatetoprops-mapdispatchtoprops--reactcomponent--reactcomponent)
    - [`options`](#options)
    - [`mapStateToProps`](#mapstatetoprops)
    - [`mapDispatchToProps`](#mapdispatchtoprops)
  - [`REDUCER_KEY`](#reducer_key)
  - [`reducer`](#reducer)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Usage

### Simple Example

```js
// List.js
import React from 'react';
import PropTypes from 'prop-types';
import { connectWithGetInitialData } from 'redux-data-ssr';
import { getList } from './actions';

const List = ({loading, list}) => {
  if (loading)
    return <span>Loading</span>;
  return (
    <div>
      <h1>List</h1>
      <ul>
        {(list||[]).map((l, i) => <li key={i}>${l}</li>)}
      </ul>
    </div>
  );
};

List.propTypes = {
  isLoading: PropTypes.bool,
  list: PropTypes.array,
};

// This function will be incharge of fetching the data
// `props` are the component properties
const getData = ({ getList }) => getList();

const mapStateToProps = state => ({
  loading: state.list.loading,
  list: state.list.data,
});

const mapDispatchToProps = dispatch => ({
  getList: () => dispatch(getList()),
});

export default connectWithGetInitialData({ getData })(mapStateToProps, mapDispatchToProps)(List);

// actions.js

export const getList = () => dispatch => {
  dispatch({ type: LIST_LOADING });
  return new Promise(rs => {
    setTimeout(() => {
      dispatch({
        type: LIST_LOADED,
        data: [
          'first',
          'second',
          'thrid',
        ],
      });
      rs();
    }, 1000);
  })
};

// client.js
import { hydrate } from 'react-dom';
import configureStore from './store';
import { Provider } from 'react-redux';
import List from './List';

const store = configureStore(window.__PRELOADED_STATE__);  // Server Side Rendered data
hydrate(
  <Provider store={store}>
    <List />,
  </Provider>,
  document.getElementById('root')
);

// store
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducer';

const configureStore = preloadedState => {
  const store = createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(thunk)
  );
  return store;
};

export default configureStore;

// reducer
import { combineReducers } from 'redux';
import { REDUCER_KEY, reducer } from 'redux-data-ssr';
import list from './reducerList';

const rootReducer = combineReducers({
  [ REDUCER_KEY ]: reducer,
  list,
});

export default rootReducer;
```

## Api

### `connectWithGetInitialData(options) => (mapStateToProps, mapDispatchToProps) => (ReactComponent) => ReactComponent`

Create a high-order React component class that fetches data server side and re uses the data in client side (or fetches it if it isn't available) using Redux as the data store.

#### `options`

The _options_ object is the same configuration of [React Data SSR](../react-data-ssr/#options).

#### `mapStateToProps`

Redux's _mapStateTopProps_ function.

#### `mapDispatchToProps`

Redux's _mapDispatchToProps_ function.

### `REDUCER_KEY`

The state's key in which _Redux data SSR_ will store information.

### `reducer`

The _reducer_ function.
