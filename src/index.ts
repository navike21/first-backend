import { startServer } from '@Config/mainServer';
import express from 'express';

const app = express();

// Middleware
app.use(express.json());

// Define your routes
app.get('/', (req, res) => {
	res.json({ message: 'Hello from Express on Vercel!' });
});

app.get('/api/health', (req, res) => {
	res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

startServer(app);

// Export for Vercel serverless
export default app;
