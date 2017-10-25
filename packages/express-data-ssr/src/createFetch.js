/** Builds a response object fetch api like
 * @param {Object} data - with properties `status` and `json`
 *
 * @return {Object} Fetch like response object
 */
function buildResponse(data) {
  return {
    get status() {
      return data.status || 200;
    },
    get ok() {
      const status = data.status || 200;
      return status >= 200 && status < 300;
    },
    type: 'SSR',
    // XXX: we will only implement `json` method
    json: () => data.json,
  };
}

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

/** Creates a response handler.
 *
 * Bassicaly is an object with two properties:
 * - handler: `{function}` a Express like response object
 * - promise: `{Promise}` a fetch like return promise
 *
 * @return {Object}
 */
function createResponseHandler() {
  const responseData = {};
  const response = buildResponse(responseData);
  let handler;
  const promise = new Promise((rs, rj) => {
    handler = {
      status: s => {
        responseData.status = s;
        return handler;
      },
      json: j => {
        responseData.json = j;
        rs(response);
        return handler;
      },
      end: () => {
        return handler;
      },
    };
  });

  return {
    promise,
    handler,
  };
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

  const { handler, promise } = createResponseHandler();
  router(createRequest(url, req || {}, opts), handler, () =>
    console.log('next')
  );

  return promise;
};

export default createFetch;
