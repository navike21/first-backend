import { handleServerShutdown, startServer } from '@Config/mainServer';
import express from 'express';

const app = express();

// Define your routes
app.get('/', (req, res) => {
	res.json({ message: 'Hello from Express on Vercel!' });
});

app.get('/api/health', (req, res) => {
	res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

startServer(app);

process.on('SIGINT', handleServerShutdown);
process.on('SIGTERM', handleServerShutdown);

// Export for Vercel serverless
export default app;
