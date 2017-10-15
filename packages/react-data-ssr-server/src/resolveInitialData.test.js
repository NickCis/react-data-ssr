const resolveInitialData = require('./resolveInitialData');

describe('resolveInitialData', () => {
  it('should call `getInitialData` of all components (react-router-config)', async () => {
    const dataA = { data: 'A' };
    const ComponentA = { getInitialData: jest.fn().mockReturnValue({key: 'componentA', promise: Promise.resolve(dataA)}) };
    const dataB = { data: 'B' };
    const ComponentB = { getInitialData: jest.fn().mockReturnValue({key: 'componentB', promise: Promise.resolve(dataB)}) };
    const branches = [
      {
        route: {
          component: ComponentA,
          routes: []
        },
        match: {
          path: '/',
          url: '/',
          params: {},
          isExact: true
        }
      },
      {
        route: {
          component: ComponentB,
          path: '/',
          exact: true
        },
        match: {
          path: '/',
          url: '/',
          isExact: true,
          params: {}
        }
      }
    ];

    const extra = { extra: 'test' };
    const promise = resolveInitialData(branches, extra);
    expect(ComponentA.getInitialData).toHaveBeenCalledWith(branches[0], extra);
    expect(ComponentB.getInitialData).toHaveBeenCalledWith(branches[1], extra);

    const { errors, store } = await promise;
    expect(store).toEqual({
      componentA: dataA,
      componentB: dataB
    });
    expect(errors).toEqual({});
  });

  it('should call `getInitialData` of all components (dictionary)', async () => {
    const dataA = { data: 'A' };
    const ComponentA = { getInitialData: jest.fn().mockReturnValue({key: 'componentA', promise: Promise.resolve(dataA)}) };
    const dataB = { data: 'B' };
    const ComponentB = { getInitialData: jest.fn().mockReturnValue({key: 'componentB', promise: Promise.resolve(dataB)}) };
    const branches = [
      {
        component: ComponentA,
        data: {
          path: '/',
          url: '/',
          params: {},
          isExact: true
        }
      },
      {
        component: ComponentB,
        data: {
          path: '/',
          url: '/',
          isExact: true,
          params: {}
        }
      }
    ];

    const extra = { extra: 'test' };
    const promise = resolveInitialData(branches, extra);
    expect(ComponentA.getInitialData).toHaveBeenCalledWith(branches[0], extra);
    expect(ComponentB.getInitialData).toHaveBeenCalledWith(branches[1], extra);

    const { errors, store } = await promise;
    expect(store).toEqual({
      componentA: dataA,
      componentB: dataB
    });
    expect(errors).toEqual({});
  });

  it('should call `getInitialData` of all components (Component)', async () => {
    const dataA = { data: 'A' };
    const ComponentA = { getInitialData: jest.fn().mockReturnValue({key: 'componentA', promise: Promise.resolve(dataA)}) };
    const dataB = { data: 'B' };
    const ComponentB = { getInitialData: jest.fn().mockReturnValue({key: 'componentB', promise: Promise.resolve(dataB)}) };
    const branches = [
      ComponentA,
      ComponentB
    ];

    const extra = { extra: 'test' };
    const promise = resolveInitialData(branches, extra);
    expect(ComponentA.getInitialData).toHaveBeenCalledWith(branches[0], extra);
    expect(ComponentB.getInitialData).toHaveBeenCalledWith(branches[1], extra);

    const { errors, store } = await promise;
    expect(store).toEqual({
      componentA: dataA,
      componentB: dataB
    });
    expect(errors).toEqual({});
  });

  it('should store failing promises on `errors`', async () => {
    const error = { cause: 'failing' };
    const Component = { getInitialData: jest.fn().mockReturnValue({key: 'component', promise: Promise.reject(error)}) };

    const promise = resolveInitialData([ Component ]);
    expect(Component.getInitialData).toHaveBeenCalledWith(Component, undefined);

    const { errors, store } = await promise;
    expect(store).toEqual({});
    expect(errors).toEqual({
      component: error,
    });
  });
});
