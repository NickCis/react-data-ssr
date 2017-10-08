/** Server side initial data resolution for react-data-ssr.
 *
 * @param {Array} branches - React router config branches o component list
 * @param {(key: String, data: Object) => null} setData - Function to store retrieved data
 * @param {Array} args - Extra arguments that will be passed to `getInitialData` (see `mapArgsToProps`)
 * @return {Promise} - Will resolve when all `getInitialData` Promise are resolved.
 */
function resolveInitialData(branches, setData, ...args) {
  const promises = branches.reduce((acc, b) => {
    const getInitialData = b.route ? b.route.component.getInitialData : b;
    if (getInitialData)
      acc = acc.concat(getInitialData(setData, ...args));
    return acc;
  }, []);
  return Promise.all(promises);
}

module.exports = resolveInitialData;
