/** Server side initial data resolution for react-data-ssr.
 *
 * This function support 3 types of branches:
 *   - React Router Config: `{ route: { component: Component, routes: [] }, match: { path: '', url: '', params: {}, isExact: } }`
 *   - Dictionary: `{ component: Component, ... }`
 *   - Component: `Component`
 *
 * The branches argument can be a mixed list of the branch types. This function searches the Component object following the previous order and calls the `getInitialData` static method.
 * Then, it waits for the returned promises to be resolved.
 *
 * @param {Array} branches - A list of branches. (React router config branches, { component: Component, ...}, component list, etc)
 * @param {Object} extra - Extra data that will be passed to `getInitialData` (see `mapArgsToProps`)
 * @return {Promise} - Will resolve when all `getInitialData` promises are resolved. It passes: `{ errors: Object, store: Object }`. `errors` is a dictionary that relates the components (by the key), that have a failing promise, with the error. `store` is a dictionary that relates successful components (by the key) with the resolved data.
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
      if (!(k in errors)) s[k] = data[i];
      return s;
    }, {}),
  }));
}

module.exports = resolveInitialData;
