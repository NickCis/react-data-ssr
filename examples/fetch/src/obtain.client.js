/** Note:
 *     Remember that the api exposed by the `createFetch()` function is *almost* the same as the `fetch` api.
 *     The only difference is that, `createFetch()` expects the query params to be in `init` options with the key `query`.
 *     In order to be compliant, the query string should be build using any module (e.g.: [query-string stringify method](https://www.npmjs.com/package/query-string#stringify-object--options-) and it should be appended to the url.
 *     (here, for the sake of simplicity we are using a custom function, stringify, in order to do that)
 *
 *     In addition, this `obtain` function is likely to receive an undefined value under the `req` key in the options.
 */
const format = (key, value) =>
  `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;

export const stringify = query =>
  Object.keys(query)
    .sort()
    .map(key => {
      const value = query[key];
      if (Array.isArray(value)) {
        key = `${key}[]`;
        return value.map(value => format(key, value)).join('&');
      }

      return format(key, value);
    })
    .join('&');

/** Fetch like protocol function.
 * @param {String} url - Target url
 * @param {Object} query - Url query params
 * @param {Object} req - Req object (for SSR compatibility, it will always be undef)
 * @param {Object} opts - Fetch configuration
 *
 * @return {Promise} Fetch like response
 */
export default (url, { query, req, ...opts } = {}) => {
  if (query) {
    const queryString = stringify(query);
    if (queryString) url = `${url}?${queryString}`;
  }

  return fetch(url, opts);
}
