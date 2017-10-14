import React from 'react';
import PropTypes from 'prop-types';
import createGenerateComponentKey from './createGenerateComponentKey';

/** High Order Component which
 * @param {(props: Object, bag: Object) => Promise} getData -
 * @param {(data: Object) => Object} mapDataToProps -
 * @param {(props: Object, nextProps: Object) => bool} shouldGetData - (optional)
 * @param {(branch: Object, extra?: Object) => Object} mapArgsToProps - (optional)
 * @param {(component: ReactComponent, props: Object) => String} generateComponentKey - (optional)
 * @return {ReactComponent}
 */
const withGetInitialData = ({
  getData,
  mapDataToProps,
  shouldGetData = () => false,
  mapArgsToProps = () => ({}),
  generateComponentKey = createGenerateComponentKey(),
}) => Component => {
  class GetInitialData extends React.Component {
    /** Static method called during SSR to fetch data
     * @param {Object} [branch] - Extra data
     * @param {Object} [extra] - Extra data
     * @return {Object} - { key: ComponentKey, promise: Promise that the data will be fetched }
     */
    static getInitialData(branch, extra) {
      let promise = Promise.resolve(null);
      const props = mapArgsToProps(branch, extra);
      const key = generateComponentKey(Component, props);

      if (getData) {
        let data = null;
        promise = getData(props, {
          // Ignore setLoading as the server will render after
          setLoading: () => {},
          // Use setData in order to retrieve data
          setData: d => data = d,
        }).then(() => data);
      }

      return {
        promise,
        key,
      };
    }

    constructor(props) {
      super(props);
      this.key = generateComponentKey(Component, props)
      this.state = {
        data: props.getInitialData(this.key),
        // We are faking the value of isLoading in order to prevent a rendering.
        // If the Component hasn't loaded, the user will call `setLoading(true)` on `getData`
        // If user doesn't do it, the value will be overriden in the `setData`.
        // There is also the case, that the user doesn't call `setLoading` / `setData`, the `isLoading` value
        // will be incorrectly setted, but also, the user won't use it. So it doesn't really matter.
        isLoading: !props.hasLoadedComponent(this.key),
      };
    }

    /** React `componentDidMount` phase.
     * As far as data fetching, it is only called on the client side when the component is mounted.
     * A double fetch has to be prevented (fetch data when the server has already provided it)
     *
     * Check if data has to be fetched, if it does, it calls `getData` of Component.
     * The idea of this method is to prevent the double fetch when hydrating SSR code.
     * It checks if the Component's key has been fetched.
     */
    componentDidMount() {
      // If Component didn't implement, do nothing
      if (!getData) return;
      if (this.props.hasLoadedComponent(this.key)) return;
      this.getData();
    }

    /** React `componentWillReceiveProps` phase.
     * It is called when props have changed.
     * We'll have to check if the change involves a new data fetch.
     */
    componentWillReceiveProps(nextProps) {
      // If Component didn't implement, do nothing
      if (!getData) return;
      if (!shouldGetData(this.props, nextProps))
        return;

      this.dismissLoadedComponent();
      this.getData(nextProps);
    }

    componentWillUnmount() {
      this.dismissLoadedComponent();
    }

    render() {
      const { isLoading, data } = this.state;
      const props = {
        ...this.props,
        ...mapDataToProps(data || {}),
      };

      return <Component isLoading={isLoading} {...props} />;
    }

    /** Performs data getting
     */
    getData(nextProps) {
      // If Component didn't implement, do nothing
      if (!getData) return;
      getData(nextProps || this.props, {
        setLoading: b => b !== this.state.isLoading && this.setState({ isLoading: b }),
        setData: d => this.setState({ isLoading: false, data: d }),
      });
    }

    /**
     */
    dismissLoadedComponent() {
      // If Component didn't implement, do nothing
      if (!getData) return;
      this.props.dismissLoadedComponent(this.key);
    }
  }

  GetInitialData.propTypes = {
    getInitialData: PropTypes.func.isRequired,
    hasLoadedComponent: PropTypes.func.isRequired,
    dismissLoadedComponent: PropTypes.func.isRequired,
  };

  return GetInitialData;
};

export default withGetInitialData;
