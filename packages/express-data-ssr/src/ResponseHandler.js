import Response from './Response';

class ResponseHandler {
  constructor() {
    this.response = new Response();
    this.hasResolved = false;
    this.promise = new Promise(rs => (this.promiseResolve = rs));
  }

  resolve() {
    if (!this.hasResolved) this.promiseResolve(this.response);
    this.hasResolved = true;
  }

  /** Promise like then
   * @return {Promise} - The chained promise
   */
  then(...args) {
    return this.promise.then(...args);
  }

  // TODO: implement more methods

  json(j) {
    this.response.json = j;
    this.resolve();
    return this;
  }

  status(s) {
    this.response.status = s;
    return this;
  }

  end() {
    this.resolve();
    return this;
  }
}

export default ResponseHandler;
