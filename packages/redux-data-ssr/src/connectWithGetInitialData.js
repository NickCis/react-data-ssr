import { withGetInitialData } from 'react-data-ssr';
import { connect } from 'react-redux';
import { dismissLoadedComponent } from './actions';
import { REDUCER_KEY } from './constants';

const connectWithGetInitialData = ({
  getData,
  shouldGetData,
  generateComponentKey,
  mapArgsToProps,
}) => (mapStateToProps, mapDispatchToProps) => C => {
  const _mapArgsToProps = (branch, extra) => {
    const { getState, dispatch } = extra;
    const props = {};

    if (mapStateToProps)
      Object.assign(props, mapStateToProps(getState()))

    if (mapDispatchToProps)
      Object.assign(props, mapDispatchToProps(dispatch))

    if (mapArgsToProps)
      Object.assign(props, mapArgsToProps(branch, extra));

    return props;
  };

  const _mapStateToProps = state => ({
    ...(mapStateToProps ? mapStateToProps(state) : {}),
    getInitialData: k => state[REDUCER_KEY].initialData[k],
    hasLoadedComponent: k => k in state[REDUCER_KEY].initialData,
  });

  const _mapDispatchToProps = dispatch => ({
    ...(mapDispatchToProps ? mapDispatchToProps(dispatch) : {}),
    dismissLoadedComponent: k => dispatch(dismissLoadedComponent(k)),
  });

  const Component = withGetInitialData({
    getData,
    shouldGetData,
    generateComponentKey,
    // Data we'll be seted / mapped by redux
    mapDataToProps: () => {},
    mapArgsToProps: _mapArgsToProps,
  })(C);

  return connect(_mapStateToProps, _mapDispatchToProps)(Component);
};

export default connectWithGetInitialData;
