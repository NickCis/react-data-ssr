# React Data SSR



## Instalation

```bash
npm -i react-data-ssr --save
```

---

<!-- START doctoc -->
<!-- END doctoc -->

## Usage

### Simple Example

```js
// List.js
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
        {(list||[]).map((l, i) => <li key={i}>${l}</li>)}
      </ul>
    </div>
  );
};

List.propTypes = {
  isLoading: PropTypes.bool,
  list: PropTypes.array,
};

// Set the Component Key to a constant
const generateComponentKey = (Component, props) => 'List';

// This function is used to map the data setted by `setData` to the component properties
const mapDataToProps = ({data}) => ({
  list: data,
});

// This function will be incharge of fetching the data
// `props` are the component properties
const getInitialData = (props, {setLoading, setData}) => new Promise(rs => {
  // Set the loading state
  setLoading(true);

  // Pretend we are doing something async
  setTimeout(() => {
    // Sets the data, it also sets the loading state to false
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
  generateComponentKey,
  mapDataToProps,
  getInitialData,
})(List);

// client.js
import { hydrate } from 'react-dom';
import List from './List';

const data = window.__INITIAL_DATA__; // Server Side Rendered data
hydrate(
  <List
    hasLoadedComponent={k => k in data}
    dismissLoadedComponent={k => delete data[k]}
    initialData={data}
  />,
  document.getElementById('root')
);
```

**Note:** The example uses _React 16_, but it's not a requeriment. _React 15_ could alse be used.

## Api

### `withGetInitialData(options)`

Create a high-order React component class that

#### `options`

##### `mapArgsToProps: (...args) => object`

##### `generateComponentKey: (component: ReactComponent, props: Object) => String`

##### `mapDataToProps: (data: Object) => Object`

##### `getInitialData: (props: Object, bag: Object) => Promise`

