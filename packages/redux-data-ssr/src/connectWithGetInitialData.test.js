import React from 'react';
import connectWithGetInitialData from './connectWithGetInitialData';
import configureMockStore from 'redux-mock-store';
import { setLoadedComponent, dismissLoadedComponent } from './actions';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { REDUCER_KEY } from './constants';
import { initialState } from './reducer';

describe('connectWithGetInitialData', () => {
  const getInitialState = () => ({
    [REDUCER_KEY]: initialState(),
  });
  const mockStore = configureMockStore();

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

  it('should get data in client', () => {
    const store = mockStore(getInitialState());
    const MockComponent = jest.fn().mockReturnValue(null);
    const getData = jest.fn().mockReturnValue(Promise.resolve(null));
    const Component = connectWithGetInitialData({getData})()(MockComponent);

    mount(
      <Provider store={store}>
        <Component />
      </Provider>
    );

    expect(getData).toHaveBeenCalled();
  });

  it('should connect with redux state / dispatch', () => {
    const store = mockStore({
      ...getInitialState(),
      test: 'test',
    });
    const MockComponent = jest.fn().mockReturnValue(null);
    const mapStateToProps = state => ({test: state.test});
    const mockAction = {type: 'TEST'};
    const mapDispatchToProps = dispatch => ({dispatch: () => dispatch(mockAction)});
    const getData = jest.fn().mockImplementation(({test, dispatch}) => {
      expect(test).toBe('test');
      dispatch();
      return Promise.resolve(null);
    });
    const Component = connectWithGetInitialData({getData})(mapStateToProps, mapDispatchToProps)(MockComponent);

    mount(
      <Provider store={store}>
        <Component />
      </Provider>
    );

    expect(getData).toHaveBeenCalled();
    expect(store.getActions()).toEqual([mockAction]);
  });

  /*it('should get initial data in SSR', () => {
    const Component = jest.fn().mockReturnValue(null);
    const getData = jest.fn().mockImplementation((props) => {
      return Promise.resolve();
    });
    const store = mockStore(initialState());
    const HocComponent = connectWithGetInitialData({getData})()(Component);

    HocComponent.getInitialData({
      dispatch: d => store.dispatch(d),
      getState: () => store.getState(),
      route: { key: 'test' },
      match: { url: 'test' },
    });

    expect(Component.getInitialData.mock.calls.length).toBe(1);
    expect(store.getActions()).toEqual([setLoadedInitialData('test')]);
  });

  it('should get initial data in web', () => {
    const Component = setup();
    const store = mockStore({ initialData: { pages: [] } });
    const HocComponent = connectWithSSR()(Component);

    mount(
      <Provider store={store}>
        <Router>
          <HocComponent route={{ key: 'test' }} match={{ url: 'test' }} />
        </Router>
      </Provider>
    );

    expect(Component.getInitialData.mock.calls.length).toBe(1);
  });

  it('should not call getInitialData on web if the data was brought in SSR (no double fetch)', () => {
    const Component = setup();
    const store = mockStore({ initialData: { pages: ['test'] } });
    const HocComponent = connectWithSSR()(Component);

    mount(
      <Provider store={store}>
        <Router>
          <HocComponent route={{ key: 'test' }} match={{ url: 'test' }} />
        </Router>
      </Provider>
    );

    expect(Component.getInitialData.mock.calls.length).toBe(0);
  });

  it('should dissmiss get initial data when unmounting', () => {
    const store = mockStore({ initialData: { pages: ['test'] } });
    const HocComponent = connectWithSSR()(setup());

    const wrapper = mount(
      <Provider store={store}>
        <Router>
          <HocComponent route={{ key: 'test' }} match={{ url: 'test' }} />
        </Router>
      </Provider>
    );

    wrapper.unmount();
    expect(store.getActions()).toEqual([dismissInitialData('test')]);
  });

  it('should not call getInitialData on web if changed props create same key (no double fetch)', done => {
    const steps = [
      ({ history }) => history.push('/test/1'),
      ({ history }) => history.push('/test/1'),
      () => {
        expect(Component.getInitialData.mock.calls.length).toBe(1);
        expect(Component.getInitialData.mock.calls[0][0]).toMatchObject({
          match: {
            url: '/test/1',
          },
          route: {
            path: '/test/:id',
          },
        });
        done();
      },
    ];

    const Component = setup();
    const HocComponent = connectWithSSR()(Component);
    const routes = [
      {
        component: setUpStepper(steps),
        routes: [
          {
            component: HocComponent,
            path: '/test/:id',
          },
        ],
      },
    ];

    const store = mockStore({ initialData: { pages: [] } });
    mount(
      <Provider store={store}>
        <Router>{renderRoutes(routes)}</Router>
      </Provider>
    );
  });

  it('should call getInitialData on web if changed props create diferent key', done => {
    const steps = [
      ({ history }) => history.push('/test/1'),
      ({ history }) => history.push('/test/2'),
      () => {
        expect(Component.getInitialData.mock.calls.length).toBe(2);
        expect(Component.getInitialData.mock.calls[0][0]).toMatchObject({
          match: {
            url: '/test/1',
          },
          route: {
            path: '/test/:id',
          },
        });
        expect(Component.getInitialData.mock.calls[1][0]).toMatchObject({
          match: {
            url: '/test/2',
          },
          route: {
            path: '/test/:id',
          },
        });
        done();
      },
    ];

    const Component = setup();
    const HocComponent = connectWithSSR()(Component);
    const routes = [
      {
        component: setUpStepper(steps),
        routes: [
          {
            component: HocComponent,
            path: '/test/:id',
          },
        ],
      },
    ];

    const store = mockStore({ initialData: { pages: [] } });
    mount(
      <Provider store={store}>
        <Router>{renderRoutes(routes)}</Router>
      </Provider>
    );
  });*/
});
