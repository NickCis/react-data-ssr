import React from 'react';
import PropTypes from 'prop-types';

/** High Order Component which
 */
const withGetInitialData = ({
  mapArgsToProps,
  generateComponentKey,
  mapDataToProps,
}) => Component => {
  class GetInitialData extends React.Component {
    constructor(props) {
      super(props);
      const componentKey = getComponentKey(generateComponentKey(Component, props));
      this.state = {
        data: (props.initialData || {})[componentKey],
        isLoading: false,
      };
    }

    /** Static method called during SSR to fetch data
     * @param {Function(componentKey, data} setData - A function used to save the fetched data while SSR.
     * @param {Object} args - all arguments applied
     * @return {Promise} - Promise that the data will be fetched
     */
    static getInitialData(setData, ...args) {
      // If Component didn't implement `getInitialData` return a promise
      if (!Component.getInitialData) return Promise.resolve(null);

      const props = mapArgsToProps(args);
      const componentKey = generateComponentKey(Component, props);

      return Component.getInitialData({
        ...props,
        // Ignore setLoading as the server will render after
        setLoading: () => {},
        // Use setData in order to retrieve data
        setData: data => setData(componentKey, data),
      });
    }

    /** React `componentDidMount` phase.
     * As far as data fetching, it is only called on the client side when the component is mounted.
     * A double fetch has to be prevented (fetch data when the server has already provided it)
     */
    componentDidMount() {
      this.fetchDataIfNeeded();
    }

    /** React `componentWillReceiveProps` phase.
     * It is called when props have changed.
     * We'll have to check if the change involves a new data fetch.
     */
    componentWillReceiveProps(nextProps) {
      // If Component didn't implement, do nothing
      if (!Component.getInitialData) return;

      const key = this.getComponentKey();
      const nextKey = generateComponentKey(Component, nextProps);

      if (key === nextKey) return;
      this.dismissLoadedComponent();
      this.fetchDataIfNeeded(nextProps, nextKey);
    }

    componentWillUnmount() {
      this.dismissLoadedComponent();
    }

    render() {
      const { isLoading, data } = this.state;
      const { initialData, hasLoadedComponent, dismissLoadedComponent, ..._props } = this.props;
      const props = {
        ..._props,
        ...(mapDataToProps(data)),
      };

      return <Component isLoading={isLoading} {...props} />;
    }

    /** Check if data has to be fetched, if it does, it calls `getInitialData` of Component.
     * The idea of this method is to prevent the double fetch when hydrating SSR code.
     * It checks if the Component's key has been fetched.
     */
    fetchDataIfNeeded(nextProps, nextKey) {
      // If Component didn't implement, do nothing
      if (!Component.getInitialData) return;

      const key = this.getComponentKey(nextKey);
      if (this.props.hasLoadedComponent(key)) return;

      Component.getInitialData({
        ...(nextProps || this.props),
        setLoading: b => this.setState({...this.state, isLoading: b}),
        setData: d => this.setState({data: d}),
      });
    }

    /**
     */
    dismissLoadedComponent() {
      // If Component didn't implement, do nothing
      if (!Component.getInitialData) return;

      const key = this.getComponentKey();
      this.props.dismissLoadedComponent(key);
    }

    getComponentKey(nextKey) {
      if (nextKey)
        this.key = nextKey;

      if (!this.key)
        this.key = generateComponentKey(Component, this.props);

      return this.key;
    }
  }

  GetInitialData.propTypes = {
    initialData: PropTypes.object,
    hasLoadedComponent: PropTypes.func.isRequired,
    dismissLoadedComponent: PropTypes.func.isRequired,
  };

  return GetInitialData;
};

export default withGetInitialData;