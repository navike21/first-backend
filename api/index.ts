import type { Application } from 'express';

const app: Application = require('../dist/server.js').default;

export default app;
