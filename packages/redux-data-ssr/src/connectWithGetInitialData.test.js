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

  it('should get data', () => {
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
});

describe('connectWithGetInitialData - SSR', () => {
  it('should get initial data', async () => {
    const MockComponent = jest.fn().mockReturnValue(null);
    const getData = jest.fn().mockReturnValue(Promise.resolve(null));
    const Component = connectWithGetInitialData({ getData })()(MockComponent);
    const store = mockStore(getInitialState());

    const { promise } = Component.getInitialData(
      {},
      { dispatch: a => store.dispatch(a), getState: () => store.getState() }
    );
    await promise;

    expect(getData).toHaveBeenCalled();
    expect(store.getActions()).toEqual([
      {
        key: 'mockConstructor-3',
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
    const Component = connectWithGetInitialData({ getData })(
      mapStateToProps,
      mapDispatchToProps
    )(MockComponent);

    const { promise } = Component.getInitialData(
      {},
      { dispatch: a => store.dispatch(a), getState: () => store.getState() }
    );
    await promise;

    expect(getData).toHaveBeenCalled();
    expect(store.getActions()).toEqual([
      mockAction,
      {
        key: 'mockConstructor-4',
        type: 'SET_LOADED_COMPONENT',
      },
    ]);
  });
});
