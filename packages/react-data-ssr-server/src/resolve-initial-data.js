/** Server side initial data resolution for react-data-ssr.
 *
 * @param {Array} branches - React router config branches, { component: Component, ...} or component list
 * @param {Object} extra - Extra data that will be passed to `getInitialData` (see `mapArgsToProps`)
 * @return {Promise} - Will resolve when all `getInitialData` promises are resolved. It passes: `{ errors: Object, store: Object }`. `errors` is a dictionary that relates the components (by the key), that have a failing promise, with the error. `store` is a dictionary that relates all the components (by the key) with the resolved data.
 */
function resolveInitialData(branches, extra) {
  const errors = {};
  const { promises, keys } = branches.reduce(
    ({ promises, keys }, b) => {
      const getInitialData = (b.route ? b.route.component : b.component || b)
        .getInitialData;

      if (getInitialData) {
        const { promise, key } = getInitialData(b, extra);
        promises.push(promise.catch(e => (errors[key] = e)));
        keys.push(key);
      }

      return {
        promises,
        keys,
      };
    },
    { promises: [], keys: [] }
  );

  return Promise.all(promises).then(data => ({
    errors,
    store: keys.reduce((s, k, i) => {
      s[k] = data[i];
      return s;
    }, {}),
  }));
}

module.exports = resolveInitialData;
