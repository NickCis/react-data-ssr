import ResponseHandler from './ResponseHandler';

/** Creates a Proxy object for the request.
 *
 * XXX: It only supports `GET`, but, will we need another method for SSR?
 *
 * @param {String} url -
 * @param {Object} req - Express request object
 * @param {String} method - GET
 * @param {Object} query - Url query parameters
 *
 * @return {Proxy} Request object
 */
function createRequest(url, req, { method, query } = {}) {
  const request = {
    url,
    method: method || 'GET',
    query: query || {},
  };

  return new Proxy(req, {
    set: (target, name, value, receiver) => {
      request[name] = value;
      return true;
    },
    get: (target, name) => {
      if (name in request) return request[name];

      switch (name) {
        // TODO:
        case 'next':
        case 'params':
        case 'baseUrl':
        case 'originalUrl':
        case '_parsedUrl':
          return undefined;

        default:
          return target[name];
      }
    },
  });
}

// TODO: next
const createFetch = (router, base = '') => (url, { req, ...opts } = {}) => {
  if (base) {
    if (!url.startsWith(base))
      return Promise.reject(
        new Error(`Server Fetch calls must start with '${base}'!`)
      );
    url = url.substr(base.length);
  }

  const handler = new ResponseHandler();
  router(createRequest(url, req || {}, opts), handler, () =>
    console.log('next')
  );
  return handler;
};

export default createFetch;
