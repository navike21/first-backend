import type { Application } from 'express';

const app: Application = require('../dist/server').default;

export default app;
