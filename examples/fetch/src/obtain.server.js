import { createFetch } from 'express-data-ssr';
import api from './api';

// Create the fetch-like function, with our api router and the url base.
const obtain = createFetch(api, '/api');

export default obtain;
