/** Server side initial data resolution for react-data-ssr.
 *
 * @param {Array} branches - React router config branches, { component: Component, ...} or component list
 * @param {(key: String, data: Object) => null} setData - Function to store retrieved data
 * @param {Object} extra - Extra data that will be passed to `getInitialData` (see `mapArgsToProps`)
 * @return {Promise} - Will resolve when all `getInitialData` Promise are resolved.
 */
function resolveInitialData(branches, setData, extra) {
  const promises = branches.reduce((acc, b) => {
    const getInitialData = (b.route ? b.route.component : b.component || b)
      .getInitialData;
    if (getInitialData) acc = acc.concat(getInitialData(setData, b, extra));
    return acc;
  }, []);
  return Promise.all(promises);
}

module.exports = resolveInitialData;
