import { handleServerShutdown, startServer } from '@Config/mainServer';
import express from 'express';

const app = express();

startServer(app);

process.on('SIGINT', handleServerShutdown);
process.on('SIGTERM', handleServerShutdown);

// Export for Vercel serverless
export default app;
