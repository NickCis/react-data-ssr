import { Router } from 'express';

const router = new Router();

router
  .get('/links', (req, res) => {
    setTimeout(() => {
      res.json({
        links: [
          { to: '/', text: 'Home' },
          { to: '/list', text: 'List' },
        ]
      });
    }, 1000);
  })
  .get('/list', (req, res) => {
    setTimeout(() => {
      res.json({
        data: [
          'first',
          'second',
          'thrid',
        ]
      });
    }, 1000);
  })
  .get('/home', (req, res) => {
    setTimeout(() => {
      res.json({
        title: 'Home',
        body: 'this is a body',
      });
    }, 1000);
  });

export default router;
