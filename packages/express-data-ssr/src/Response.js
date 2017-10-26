class Response {
  /**
   * @param {Object} data - with properties `status` and `json`
   */
  constructor(data = {}) {
    this.data = Object.assign({}, data);
  }

  get status() {
    return this.data.status || 200;
  }

  set status(status) {
    this.data.status = status;
  }

  get ok() {
    return this.status >= 200 && this.status < 300;
  }

  get type() {
    return 'SSR';
  }

  // XXX: we will only implement `json` method
  get json() {
    return () => Promise.resolve(this.data.json || {});
  }

  set json(json) {
    this.data.json = json;
  }
}

export default Response;
