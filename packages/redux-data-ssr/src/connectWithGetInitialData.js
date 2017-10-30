import { withGetInitialData } from 'react-data-ssr';
import { connect } from 'react-redux';
import { setLoadedComponent, dismissLoadedComponent } from './actions';
import { REDUCER_KEY } from './constants';

const connectWithGetInitialData = ({ mapArgsToProps, ...conf }) => (
  mapStateToProps,
  mapDispatchToProps
) => C => {
  const _mapArgsToProps = (branch, extra) => {
    const { getState, dispatch } = extra;
    const props = {};

    if (mapArgsToProps) Object.assign(props, mapArgsToProps(branch, extra));

    if (mapStateToProps)
      Object.assign(props, mapStateToProps(getState(), props));

    if (mapDispatchToProps)
      Object.assign(props, mapDispatchToProps(dispatch, props));

    return props;
  };

  const _mapStateToProps = (state, ownProps) => ({
    ...(mapStateToProps ? mapStateToProps(state, ownProps) : {}),
    getInitialData: k => state[REDUCER_KEY].initialData[k],
    hasLoadedComponent: k => state[REDUCER_KEY].initialData[k],
  });

  const _mapDispatchToProps = (dispatch, ownProps) => ({
    ...(mapDispatchToProps ? mapDispatchToProps(dispatch, ownProps) : {}),
    dismissLoadedComponent: k => dispatch(dismissLoadedComponent(k)),
  });

  const Component = withGetInitialData({
    ...conf,
    // Data we'll be seted / mapped by redux
    mapDataToProps: () => {},
    mapArgsToProps: _mapArgsToProps,
  })(C);

  // getInitialData will be overriden in order to dispatch `setLoadedComponent` action
  const getInitialData = Component.getInitialData;
  Component.getInitialData = (branch, extra, ...args) => {
    const ret = getInitialData(branch, extra, ...args);
    const { promise, key } = ret;
    const { dispatch } = extra;

    ret.promise = promise.then(
      d => {
        dispatch(setLoadedComponent(key));
        return d;
      },
      e => {
        dispatch(setLoadedComponent(key));
        return Promise.reject(e);
      }
    );

    return ret;
  };

  return connect(_mapStateToProps, _mapDispatchToProps)(Component);
};

export default connectWithGetInitialData;
