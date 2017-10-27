import createFetch from './createFetch';

describe('createFetch', () => {
  it('should return a function', () => {
    expect(typeof createFetch()).toBe('function');
  });

  it('should remove base in calls', () => {
    const router = jest.fn().mockImplementation((req, res, next) => {
      expect(req.url).toBe('/endpoint');
    });
    const fetch = createFetch(router, '/api');

    fetch('/api/endpoint', { req: {} });

    expect(router).toHaveBeenCalledTimes(1);
  });

  it('should preserve cookies', () => {
    const cookies = { test: 'test' };
    const router = jest.fn().mockImplementation((req, res, next) => {
      expect(req.cookies).toBe(cookies);
    });
    const fetch = createFetch(router, '/api');

    fetch('/api/endpoint', {
      req: { cookies },
    });

    expect(router).toHaveBeenCalled();
  });

  it('should preserve session', () => {
    const session = { test: 'test' };
    const router = jest.fn().mockImplementation((req, res, next) => {
      expect(req.session).toBe(session);
    });
    const fetch = createFetch(router, '/api');

    fetch('/api/endpoint', {
      req: { session },
    });

    expect(router).toHaveBeenCalled();
  });

  it('should not change original `req`', () => {
    const req = {};
    const router = jest.fn().mockImplementation((_req, res, next) => {
      _req.test = 'asd';
      expect(req.test).toBe(undefined);
    });
    const fetch = createFetch(router, '/api');

    fetch('/api/endpoint', { req });

    expect(router).toHaveBeenCalled();
  });

  it('should set correctly the `query`', () => {
    const query = { test: 'test' };
    const router = jest.fn().mockImplementation((req, res, next) => {
      expect(req.query).toBe(query);
    });
    const fetch = createFetch(router, '/api');

    fetch('/api/endpoint', { req: {}, query });

    expect(router).toHaveBeenCalled();
  });

  it('should set default status to 200', async () => {
    const router = jest.fn().mockImplementation((req, res, next) => {
      res.json({});
    });
    const fetch = createFetch(router, '/api');
    const response = await fetch('/api/test');

    expect(response.status).toBe(200);
  });

  it('should set correctly the status', async () => {
    const router = jest.fn().mockImplementation((req, res, next) => {
      res.status(205).json({});
    });
    const fetch = createFetch(router, '/api');
    const response = await fetch('/api/test');

    return expect(response.status).toBe(205);
  });

  it('should set correctly ok (true if status in range)', async () => {
    const router = jest.fn().mockImplementation((req, res, next) => {
      res.status(205).json({});
    });
    const fetch = createFetch(router, '/api');
    const response = await fetch('/api/test');

    expect(response.ok).toBe(true);
  });

  it('should set correctly ok (false if status in range)', async () => {
    const router = jest.fn().mockImplementation((req, res, next) => {
      res.status(404).json({});
    });
    const fetch = createFetch(router, '/api');
    const response = await fetch('/api/test');

    expect(response.ok).toBe(false);
  });

  it('should have a json() method that returns the json', async () => {
    const json = { test: '123' };
    const router = jest.fn().mockImplementation((req, res, next) => {
      res.json(json);
    });
    const fetch = createFetch(router, '/api');
    const response = await fetch('/api/test');

    expect(await response.json()).toBe(json);
  });

  it('should return a 404 response if `next` is called', async () => {
    const router = jest.fn().mockImplementation((req, res, next) => {
      next();
    });
    const fetch = createFetch(router, '/api');
    const response = await fetch('/api/test');

    expect(response.status).toBe(404);
  });

  it('should throw an error if url is out of api', () => {
    const router = jest.fn();
    const fetch = createFetch(router, '/api');

    return expect(fetch('/another/thing')).rejects.toBeDefined();
  });
});
