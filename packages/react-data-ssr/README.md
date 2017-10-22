# React Data SSR

This package provides a High Order Component to make SSR and data fetching painless.

## Instalation

```bash
yarn -i react-data-ssr

# Or using npm
npm -i react-data-ssr --save
```

## Examples

The [examples](../../examples) folder contains several exmaples.

---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Usage](#usage)
  - [Simple Example](#simple-example)
- [Api](#api)
  - [`withGetInitialData(options)`](#withgetinitialdataoptions)
    - [`options`](#options)
      - [`getData: (props: Object, bag: Object) => Promise`](#getdata-props-object-bag-object--promise)
      - [`mapDataToProps: (data: Object, ownProps: Object) => Object`](#mapdatatoprops-data-object-ownprops-object--object)
      - [`mapArgsToProps?: (branch: Object, extra?: Object) => Object` _(optional)_](#mapargstoprops-branch-object-extra-object--object-_optional_)
      - [`shouldGetData?: (props: Object, nextProps: Object) => boolean`  _(optional)_](#shouldgetdata-props-object-nextprops-object--boolean--_optional_)
      - [`generateComponentKey?: (component: ReactComponent, props: Object) => String`  _(optional)_](#generatecomponentkey-component-reactcomponent-props-object--string--_optional_)
    - [Injected props and methods](#injected-props-and-methods)
    - [Props](#props)
  - [`<WithGetInitialDataComponent />`](#withgetinitialdatacomponent-)
    - [Props](#props-1)
      - [`getInitialData: (key: String) => Object`](#getinitialdata-key-string--object)
      - [`hasLoadedComponent: (key: String) => bool`](#hasloadedcomponent-key-string--bool)
      - [`dismissLoadedComponent: (key:String) => null`](#dismissloadedcomponent-keystring--null)
    - [Methods](#methods)
      - [static `getInitialData(branch?: Object, extra?: Object) => {key: String, promise: Promise}`](#static-getinitialdatabranch-object-extra-object--key-string-promise-promise)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Usage

### Simple Example

```js
// List.js
import React from 'react';
import PropTypes from 'prop-types';
import { withGetInitialData } from 'react-data-ssr';

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

// This function is used to map the data setted by `setData` to the component properties
const mapDataToProps = ({data}) => ({
  list: data,
});

// This function will be incharge of fetching the data
// `props` are the component properties
const getData = (props, {setLoading, setData}) => new Promise(rs => {
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
  mapDataToProps,
  getData,
})(List);

// client.js
import { hydrate } from 'react-dom';
import List from './List';

const data = window.__INITIAL_DATA__; // Server Side Rendered data
hydrate(
  <List
    hasLoadedComponent={k => k in data}
    dismissLoadedComponent={k => delete data[k]}
    getInitialData={k => data[k]}
  />,
  document.getElementById('root')
);
```

**Note:** The example uses _React 16_, but it's not a requeriment. _React 15_ could alse be used.

## Api

### `withGetInitialData(options)`

Create a high-order React component class that fetches data server side and re uses the data in client side (or fetches it if it isn't available).

#### `options`

##### `getData: (props: Object, bag: Object) => Promise`

This function is called to perform the fetch of the data.

- `props`: The component properties, on server side they are created by [`mapArgsToProps` function](#mapargstoprops-branch-object-extra-object--object-_optional_).
- `bag`: An object with two methods:
  - `setLoading: (b: bool) => null`: To set the `isLoading` property.
  - `setData: (data: Object) => null`: To set the `data`, it will set `isLoading` to `false`.

**Note:** Server and client will call the same function, in order to provide different data fetching logic, one could use [Webpack's Normal Module Replacement Plugin](https://webpack.js.org/plugins/normal-module-replacement-plugin/) and implement a package with the same inteface.

**Note:** This function is required

##### `mapDataToProps: (data: Object, ownProps: Object) => Object`

This function is used to map the data fetched to component properties.

The result of this function must be a plain object that will be merged to the component's props.

- `data`: Is the `data` object setted with the `setData` function in the `getData` phase.
- `ownProps`: Is an object with the props of the component

**Note:** This function is required

##### `mapArgsToProps?: (branch: Object, extra?: Object) => Object` _(optional)_

This function is used to build the component's props on server side.

- `branch: Object`: Data resolution is done by passing an array of _React Router Config's Branches_, Objects or Components to `resolveInitialData` function. `branch` is the current item of that array. _The `branch` argument passed to the [`getInitialData` static method_](#static-getinitialdatabranch-object-extra-object--key-string-promise-promise).
- `extra?: Object`: The _extra_ argument passed to the `getInitialData` static method or to `resolveInitialData`.

During SSR, in order to fetch data, the component's static method [`getInitialData`](#static-getinitialdatabranch-object-extra-object--key-string-promise-promise) will be called. `mapArgsToProps` is used to map the arguments passed to that static method into the component's props.

##### `shouldGetData?: (props: Object, nextProps: Object) => boolean`  _(optional)_

Function used to check if should get data in the `componentWillReceiveProps` phase. The purpose of this function is to allow the re fetch of data if the properties passed to the Component have changed. By default, this function always returns false.

It receives two parameters:
- `props: Object`: The current Component properties.
- `nextProps: Object`: The next Component properties.

##### `generateComponentKey?: (component: ReactComponent, props: Object) => String`  _(optional)_

Server side data and client side data is related by a component key. By default, each Component has an auto incremented key which is generated by the import order (we are assuming that the client and the server will import components in the same order).

There are some cases _(1)_, when we will need to make the key to depend of the component properties.

**1**: The simplest example is when data fetching depends on _React Router's Match_. On client side, we will want to re fetch when the url is change, this won't trigger an _unmount_, but a _componentWillReceiveProps_.

#### Injected props and methods

#### Props

All the mapped properties by the `mapDataToProps` function.

### `<WithGetInitialDataComponent />`

`<WithGetInitialDataComponent />` refers to the components created by the [`withGetInitialData(options)`](#withgetinitialdataoptions) function.

#### Props

This section describes the properties that could be passed to the Component.

##### `getInitialData: (key: String) => Object`

A function that is used to retrieve the initial data through the component key.

##### `hasLoadedComponent: (key: String) => bool`

A function that is used to check if a Component (through it's key) has his data available.

##### `dismissLoadedComponent: (key:String) => null`

A function that is used to dismiss a previously loaded data.

A component will dismiss when it's unmounted (or when it's properties have changed and `shouldGetData` returned `true`).

#### Methods

This section describes the methods provided by the Component.

##### static `getInitialData(branch?: Object, extra?: Object) => {key: String, promise: Promise}`

This method should be called server side in order to fetch the component data. It will return a Promise which will be resolved when the data has been fetched. The result of the promise is the data fetched (setted by the `setData` function called in `getInitialData`).

- `branch?: Object`: Data resolution is done by passing an array of _React Router Config's Branches_, Objects or Components to `resolveInitialData` function. `branch` is the current item of that array. _The `branch` argument passed to the `getInitialData` static method_.
- `extra?: Object`: Extra argument that will be used to in order to build the Component's prop. [See `mapArgsToProps`](#mapargstoprops-branch-object-extra-object--object-_optional_).

