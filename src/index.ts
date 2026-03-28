import { PORT } from '@Constants/environments';
import express from 'express';

const app = express();

// Middleware
app.use(express.json());

// Define your routes
app.get('/', (req, res) => {
	res.json({ message: 'Hello from Express on Vercel! ' + PORT });
});

app.get('/api/health', (req, res) => {
	res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
	app.listen(PORT, () => {
		console.log(`Server running locally on http://localhost:${PORT}`);
		console.log(`Press Ctrl+C to stop`);
	});
}

// Export for Vercel serverless
export default app;
