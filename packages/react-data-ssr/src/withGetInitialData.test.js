import withGetInitialData from './withGetInitialData';
import React from 'react';
import { mount } from 'enzyme';

describe('withGetInitialData SSR', () => {
  it('should get initial data', async () => {
    const getData = jest.fn().mockReturnValue(Promise.resolve());
    const mapDataToProps = jest.fn();
    const Component = withGetInitialData({
      getData,
      mapDataToProps,
    })(jest.fn().mockReturnValue(null));

    const { promise } = Component.getInitialData();
    await promise;
    expect(getData).toHaveBeenCalled();
  });

  it('should return the setted data', async () => {
    const data = { test: 'data' };
    const getData = jest.fn().mockImplementation(
      (props, { setData }) =>
        new Promise(rs => {
          setData(data);
          rs();
        })
    );
    const mapDataToProps = jest.fn();
    const Component = withGetInitialData({
      getData,
      mapDataToProps,
    })(jest.fn().mockReturnValue(null));

    const { promise } = Component.getInitialData();
    await expect(promise).resolves.toBe(data);
    expect(getData).toHaveBeenCalled();
  });

  it('should call `getData` with mapped props', async () => {
    const branch = { match: 'match' };
    const extra = { test: 'test' };
    const getData = jest.fn().mockImplementation(props => {
      expect(props).toEqual({ match: branch.match, test: extra.test });
      return Promise.resolve();
    });

    const mapArgsToProps = jest.fn().mockImplementation((_branch, _extra) => {
      expect(_branch).toBe(branch);
      expect(_extra).toBe(extra);
      return {
        match: _branch.match,
        test: _extra.test,
      };
    });

    const mapDataToProps = jest.fn();
    const Component = withGetInitialData({
      getData,
      mapArgsToProps,
      mapDataToProps,
    })(jest.fn().mockReturnValue(null));
    const { promise } = Component.getInitialData(branch, extra);
    await promise;
    expect(mapArgsToProps).toHaveBeenCalledWith(branch, extra);
    expect(getData).toHaveBeenCalled();
  });

  it('should return the created key', () => {
    const mockKey = 'test-key';
    const getData = jest.fn().mockReturnValue(Promise.resolve());
    const mapDataToProps = jest.fn();
    const generateComponentKey = jest.fn().mockReturnValue(mockKey);
    const Component = withGetInitialData({
      getData,
      mapDataToProps,
      generateComponentKey,
    })(jest.fn().mockReturnValue(null));

    const { key } = Component.getInitialData();
    expect(generateComponentKey).toHaveBeenCalled();
    expect(key).toBe(mockKey);
  });

  it('should call `generateComponentKey` with mapped props', async () => {
    const mockComponent = jest.fn().mockReturnValue(null);
    const branch = { match: 'match' };
    const extra = { test: 'test' };
    const getData = jest.fn().mockReturnValue(Promise.resolve());
    const generateComponentKey = jest
      .fn()
      .mockImplementation((Component, props) => {
        expect(Component).toBe(mockComponent);
        expect(props).toEqual({ match: branch.match, test: extra.test });
        return 'test-key';
      });

    const mapArgsToProps = jest.fn().mockImplementation((_branch, _extra) => {
      expect(_branch).toBe(branch);
      expect(_extra).toBe(extra);
      return {
        match: _branch.match,
        test: _extra.test,
      };
    });

    const mapDataToProps = jest.fn();
    const Component = withGetInitialData({
      getData,
      mapArgsToProps,
      mapDataToProps,
      generateComponentKey,
    })(mockComponent);
    Component.getInitialData(branch, extra);
    expect(mapArgsToProps).toHaveBeenCalledWith(branch, extra);
    expect(generateComponentKey).toHaveBeenCalled();
  });
});

describe('withGetInitialData Component', () => {
  it('should render without exploding', () => {
    const MockComponent = jest.fn().mockReturnValue(null);
    const Component = withGetInitialData({
      mapDataToProps: () => ({}),
    })(MockComponent);

    mount(
      <Component
        getInitialData={jest.fn()}
        hasLoadedComponent={jest.fn()}
        dismissLoadedComponent={jest.fn()}
      />
    );
  });

  it('should getData while mounting', () => {
    const getData = jest.fn().mockReturnValue(Promise.resolve());
    const mapDataToProps = jest.fn();
    const Component = withGetInitialData({
      getData,
      mapDataToProps,
    })(jest.fn().mockReturnValue(null));

    mount(
      <Component
        getInitialData={jest.fn()}
        hasLoadedComponent={jest.fn()}
        dismissLoadedComponent={jest.fn()}
      />
    );
    expect(getData).toHaveBeenCalled();
  });

  it('should not getData if it has been already broght (no double fetch)', () => {
    const getData = jest.fn().mockReturnValue(Promise.resolve());
    const mapDataToProps = jest.fn();
    const Component = withGetInitialData({
      getData,
      mapDataToProps,
    })(jest.fn().mockReturnValue(null));

    mount(
      <Component
        getInitialData={jest.fn()}
        hasLoadedComponent={() => true}
        dismissLoadedComponent={jest.fn()}
      />
    );
    expect(getData).not.toHaveBeenCalled();
  });

  it('should pass component key to `hasLoadedComponent`', () => {
    const getData = jest.fn().mockReturnValue(Promise.resolve());
    const mapDataToProps = jest.fn();
    const Component = withGetInitialData({
      getData,
      mapDataToProps,
    })(jest.fn().mockReturnValue(null));
    const hasLoadedComponent = jest.fn().mockReturnValue(true);
    const { key } = Component.getInitialData();

    mount(
      <Component
        getInitialData={jest.fn()}
        hasLoadedComponent={hasLoadedComponent}
        dismissLoadedComponent={jest.fn()}
      />
    );
    expect(hasLoadedComponent).toHaveBeenCalledWith(key);
  });

  it('should dismiss data when unmounting', () => {
    const getData = jest.fn().mockReturnValue(Promise.resolve());
    const mapDataToProps = jest.fn();
    const Component = withGetInitialData({
      getData,
      mapDataToProps,
    })(jest.fn().mockReturnValue(null));

    const { key } = Component.getInitialData();
    const dismissLoadedComponent = jest.fn();
    const wrapper = mount(
      <Component
        getInitialData={jest.fn()}
        hasLoadedComponent={jest.fn()}
        dismissLoadedComponent={dismissLoadedComponent}
      />
    );
    expect(dismissLoadedComponent).not.toHaveBeenCalled();
    wrapper.unmount();
    expect(dismissLoadedComponent).toHaveBeenCalledWith(key);
  });

  it('should use `generateComponentKey`', () => {
    const key = 'test-key';
    const mockComponent = jest.fn().mockReturnValue(null);
    const getData = jest.fn().mockReturnValue(Promise.resolve());
    const mapDataToProps = jest.fn();
    const generateComponentKey = jest
      .fn()
      .mockImplementation((Component, props) => {
        expect(Component).toBe(mockComponent);
        expect(props).toEqual({
          getInitialData,
          hasLoadedComponent,
          dismissLoadedComponent,
        });
        return key;
      });

    const Component = withGetInitialData({
      getData,
      mapDataToProps,
      generateComponentKey,
    })(mockComponent);

    const getInitialData = jest.fn();
    const hasLoadedComponent = jest.fn();
    const dismissLoadedComponent = jest.fn();

    const wrapper = mount(
      <Component
        getInitialData={getInitialData}
        hasLoadedComponent={hasLoadedComponent}
        dismissLoadedComponent={dismissLoadedComponent}
      />
    );
    wrapper.unmount();

    expect(getInitialData).toHaveBeenCalledWith(key);
    expect(hasLoadedComponent).toHaveBeenCalledWith(key);
    expect(dismissLoadedComponent).toHaveBeenCalledWith(key);
  });

  it('should not refetch if properties have changed (default behaviour)', () => {
    const getData = jest.fn();
    const mapDataToProps = jest.fn();
    const Component = withGetInitialData({
      getData,
      mapDataToProps,
    })(jest.fn().mockReturnValue(null));

    const dismissLoadedComponent = jest.fn();

    const wrapper = mount(
      <Component
        getInitialData={jest.fn()}
        hasLoadedComponent={jest.fn()}
        dismissLoadedComponent={dismissLoadedComponent}
        testProp={1}
      />
    );
    expect(dismissLoadedComponent).not.toHaveBeenCalled();
    expect(getData).toHaveBeenCalled();
    wrapper.setProps({ testProp: 2 });
    expect(getData).toHaveBeenCalledTimes(1);
  });

  it('should refetch if properties have changed and `shouldGetData` says so', () => {
    const getData = jest.fn();
    const shouldGetData = jest.fn().mockImplementation((props, nextProps) => {
      expect(props).toEqual({
        getInitialData,
        hasLoadedComponent,
        dismissLoadedComponent,
        testProp: 1,
      });
      expect(nextProps).toEqual({
        getInitialData,
        hasLoadedComponent,
        dismissLoadedComponent,
        testProp: 2,
      });
      return true;
    });
    const mapDataToProps = jest.fn();
    const Component = withGetInitialData({
      getData,
      mapDataToProps,
      shouldGetData,
    })(jest.fn().mockReturnValue(null));

    const getInitialData = jest.fn();
    const hasLoadedComponent = jest.fn();
    const dismissLoadedComponent = jest.fn();
    const wrapper = mount(
      <Component
        getInitialData={getInitialData}
        hasLoadedComponent={hasLoadedComponent}
        dismissLoadedComponent={dismissLoadedComponent}
        testProp={1}
      />
    );

    expect(dismissLoadedComponent).not.toHaveBeenCalled();
    expect(getData).toHaveBeenCalled();
    wrapper.setProps({ testProp: 2 });
    expect(getData).toHaveBeenCalledTimes(2);
  });

  it('should map data to properties with initial data', () => {
    const data = { test: 'yes' };
    const mapDataToProps = jest.fn().mockImplementation(data => ({
      testProp: data.test,
    }));

    const MockComponent = jest.fn().mockImplementation(({ testProp }) => {
      expect(testProp).toBe(data.test);
      return null;
    });

    const Component = withGetInitialData({
      getData: jest.fn(),
      mapDataToProps,
    })(MockComponent);

    mount(
      <Component
        getInitialData={() => data}
        hasLoadedComponent={() => true}
        dismissLoadedComponent={jest.fn()}
      />
    );

    expect(MockComponent).toHaveBeenCalled();
    expect(mapDataToProps).toHaveBeenCalledWith(data);
  });

  it('should set `isLoading` to true if data has to be fetched', () => {
    const mapDataToProps = jest.fn();
    const MockComponent = jest.fn().mockImplementation(({ isLoading }) => {
      expect(isLoading).toBe(true);
      return null;
    });

    const getData = jest.fn().mockImplementation((props, { setLoading }) => {
      setLoading(true);
      return Promise.resolve();
    });

    const Component = withGetInitialData({
      getData,
      mapDataToProps,
    })(MockComponent);

    mount(
      <Component
        getInitialData={jest.fn()}
        hasLoadedComponent={jest.fn()}
        dismissLoadedComponent={jest.fn()}
      />
    );
    expect(MockComponent).toHaveBeenCalledTimes(1);
  });

  it('should set `isLoading` to false if data has not to be fetched', () => {
    const mapDataToProps = jest.fn();
    const MockComponent = jest.fn().mockImplementation(({ isLoading }) => {
      expect(isLoading).toBe(false);
      return null;
    });

    const getData = jest.fn().mockReturnValue(Promise.resolve());

    const Component = withGetInitialData({
      getData,
      mapDataToProps,
    })(MockComponent);

    mount(
      <Component
        getInitialData={jest.fn()}
        hasLoadedComponent={jest.fn().mockReturnValue(true)}
        dismissLoadedComponent={jest.fn()}
      />
    );
    expect(MockComponent).toHaveBeenCalledTimes(1);
  });

  it('should change the `isLoading` when data is setted', done => {
    const data = { test: 'test' };
    let expectFunc = ({ isLoading }) => {
      expect(isLoading).toBe(true);
    };
    const mapDataToProps = jest
      .fn()
      .mockImplementation(({ test }) => ({ test }));
    const MockComponent = jest.fn().mockImplementation(props => {
      expectFunc(props);
      return null;
    });

    let resolve;
    const promise = new Promise(rs => (resolve = rs));
    const getData = jest
      .fn()
      .mockImplementation((props, { setLoading, setData }) => {
        setLoading(true);
        return promise.then(() => setData(data));
      });
    const Component = withGetInitialData({
      getData,
      mapDataToProps,
    })(MockComponent);

    mount(
      <Component
        getInitialData={jest.fn()}
        hasLoadedComponent={jest.fn()}
        dismissLoadedComponent={jest.fn()}
      />
    );

    expect(MockComponent).toHaveBeenCalledTimes(1);
    expectFunc = ({ isLoading, test }) => {
      expect(isLoading).toBe(false);
      expect(test).toBe(data.test);
      expect(MockComponent).toHaveBeenCalledTimes(2);
      done();
    };
    resolve();
  });
});
