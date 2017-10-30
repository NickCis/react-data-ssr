import React from 'react';
import connectWithGetInitialData from './connectWithGetInitialData';
import configureMockStore from 'redux-mock-store';
import { setLoadedComponent, dismissLoadedComponent } from './actions';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { REDUCER_KEY } from './constants';
import { initialState } from './reducer';

const getInitialState = () => ({
  [REDUCER_KEY]: initialState(),
});
const mockStore = configureMockStore();
const generateComponentKey = () => 'component-key';

describe('connectWithGetInitialData - Client', () => {
  it('should render without exploding', () => {
    const store = mockStore(getInitialState());
    const MockComponent = jest.fn().mockReturnValue(null);
    const Component = connectWithGetInitialData({
      getData: jest.fn().mockReturnValue(null),
    })()(MockComponent);

    mount(
      <Provider store={store}>
        <Component />
      </Provider>
    );
  });

  it('should get data (no dispatch SET_LOADED_COMPONENT)', () => {
    const store = mockStore(getInitialState());
    const MockComponent = jest.fn().mockReturnValue(null);
    const getData = jest.fn().mockReturnValue(Promise.resolve(null));
    const Component = connectWithGetInitialData({ getData })()(MockComponent);

    mount(
      <Provider store={store}>
        <Component />
      </Provider>
    );

    expect(getData).toHaveBeenCalled();
    expect(store.getActions()).toEqual([]);
  });

  it('should connect with redux state / dispatch', () => {
    const store = mockStore({
      ...getInitialState(),
      test: 'test',
    });
    const MockComponent = jest.fn().mockReturnValue(null);
    const mapStateToProps = state => ({ test: state.test });
    const mockAction = { type: 'TEST' };
    const mapDispatchToProps = dispatch => ({
      dispatch: () => dispatch(mockAction),
    });
    const getData = jest.fn().mockImplementation(({ test, dispatch }) => {
      expect(test).toBe('test');
      dispatch();
      return Promise.resolve(null);
    });
    const Component = connectWithGetInitialData({ getData })(
      mapStateToProps,
      mapDispatchToProps
    )(MockComponent);

    mount(
      <Provider store={store}>
        <Component />
      </Provider>
    );

    expect(getData).toHaveBeenCalled();
    expect(store.getActions()).toEqual([mockAction]);
  });

  it('should connect with redux state / dispatch (access to ownProps)', () => {
    const store = mockStore({
      ...getInitialState(),
      test: 'test',
    });
    const MockComponent = jest.fn().mockReturnValue(null);
    const mapStateToProps = (state, ownProps) => {
      expect(ownProps.myOwnProp).toBe('myOwnProp');
      return { test: state.test };
    };
    const mapArgsToProps = (branch, extra) => ({
      myOwnProp: extra.myOwnProp,
    });
    const getData = jest.fn().mockImplementation(({ test, dispatch }) => {
      expect(test).toBe('test');
      return Promise.resolve(null);
    });
    const Component = connectWithGetInitialData({ getData, mapArgsToProps })(
      mapStateToProps
    )(MockComponent);

    mount(
      <Provider store={store}>
        <Component myOwnProp="myOwnProp" />
      </Provider>
    );

    expect(getData).toHaveBeenCalled();
  });

  it('should dismiss data (dispatch DISMISS_LOADED_COMPONENT)', () => {
    const store = mockStore(getInitialState());
    const MockComponent = jest.fn().mockReturnValue(null);
    const getData = jest.fn().mockReturnValue(Promise.resolve(null));
    const Component = connectWithGetInitialData({
      getData,
      generateComponentKey,
    })()(MockComponent);

    const wrapper = mount(
      <Provider store={store}>
        <Component />
      </Provider>
    );

    store.clearActions();
    wrapper.unmount();
    expect(store.getActions()).toEqual([
      { key: 'component-key', type: 'DISMISS_LOADED_COMPONENT' },
    ]);
  });
});

describe('connectWithGetInitialData - SSR', () => {
  it('should get initial data (dispatch SET_LOADED_COMPONENT)', async () => {
    const MockComponent = jest.fn().mockReturnValue(null);
    const getData = jest.fn().mockReturnValue(Promise.resolve(null));
    const Component = connectWithGetInitialData({
      getData,
      generateComponentKey,
    })()(MockComponent);
    const store = mockStore(getInitialState());

    const { promise } = Component.getInitialData(
      {},
      { dispatch: a => store.dispatch(a), getState: () => store.getState() }
    );
    await promise;

    expect(getData).toHaveBeenCalled();
    expect(store.getActions()).toEqual([
      {
        key: 'component-key',
        type: 'SET_LOADED_COMPONENT',
      },
    ]);
  });

  it('should connect with redux state / dispatch', async () => {
    const store = mockStore({
      ...getInitialState(),
      test: 'test',
    });
    const MockComponent = jest.fn().mockReturnValue(null);
    const mapStateToProps = state => ({ test: state.test });
    const mockAction = { type: 'TEST' };
    const mapDispatchToProps = dispatch => ({
      dispatch: () => dispatch(mockAction),
    });
    const getData = jest.fn().mockImplementation(({ test, dispatch }) => {
      expect(test).toBe('test');
      dispatch();
      return Promise.resolve(null);
    });
    const Component = connectWithGetInitialData({
      getData,
      generateComponentKey,
    })(mapStateToProps, mapDispatchToProps)(MockComponent);

    const { promise } = Component.getInitialData(
      {},
      { dispatch: a => store.dispatch(a), getState: () => store.getState() }
    );
    await promise;

    expect(getData).toHaveBeenCalled();
    expect(store.getActions()).toEqual([
      mockAction,
      {
        key: 'component-key',
        type: 'SET_LOADED_COMPONENT',
      },
    ]);
  });

  it('should connect with redux state / dispatch (access to ownProps)', async () => {
    const store = mockStore({
      ...getInitialState(),
      test: 'test',
    });
    const MockComponent = jest.fn().mockReturnValue(null);
    const mapStateToProps = (state, ownProps) => {
      expect(ownProps.myOwnProp).toBe('myOwnProp');
      return { test: state.test };
    };
    const mapArgsToProps = (branch, extra) => ({
      myOwnProp: extra.myOwnProp,
    });
    const getData = jest.fn().mockImplementation(({ test }) => {
      expect(test).toBe('test');
      return Promise.resolve(null);
    });
    const Component = connectWithGetInitialData({
      getData,
      generateComponentKey,
      mapArgsToProps,
    })(mapStateToProps)(MockComponent);

    const { promise } = Component.getInitialData(
      {},
      {
        dispatch: a => store.dispatch(a),
        getState: () => store.getState(),
        myOwnProp: 'myOwnProp',
      }
    );
    await promise;

    expect(getData).toHaveBeenCalled();
  });
});
