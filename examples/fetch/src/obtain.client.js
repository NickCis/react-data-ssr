/** Note:
 *     Remember that the api exposed by the `createFetch()` function is *almost* the same as the `fetch` api.
 *     The only difference is that, `createFetch()` expects the query params to be in `init` options with the key `query`.
 *     In order to be compliant, the query string should be build using any module (e.g.: [query-string stringify method](https://www.npmjs.com/package/query-string#stringify-object--options-) and it should be appended to the url.
 *
 *     In addition, this `obtain` function is likely to receive an undefined value under the `req` key in the options.
 */
export default fetch;
