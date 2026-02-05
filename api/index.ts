import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { ApiResponder } from '../src/utils/response-handler.js';

// Routers
import authRouter from './auth/router.js';
import userRouter from './users/router.js';

dotenv.config({ path: process.env.DOTENV_CONFIG_PATH ?? '.env' });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);
app.use(express.json());

// Health check
app.get('/health', (_, res) => {
  res.json({
    status: 'ok',
    message: 'FIRST Backend is running!',
    node: process.version,
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/auth', authRouter);
app.use('/users', userRouter);

// 404 handler
app.use((_, res) => {
  ApiResponder.notFound(res, { message: 'Route not found' });
});

// Error handler
app.use(
  (
    err: Error,
    _: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error('Unhandled error:', err);
    ApiResponder.internalError(res, { error: err });
  }
);

app.listen(PORT, () => {
  console.info(`🚀 Server running on http://localhost:${PORT}`);
});
