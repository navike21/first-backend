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

// Only listen if this file is run directly (not imported as module)
// This allows local development while letting Vercel import the app
if (require.main === module) {
	app.listen(PORT, () => {
		console.log(`Server running locally on http://localhost:${PORT}`);
		console.log(`Press Ctrl+C to stop`);
	});
}

// Export for Vercel serverless
export default app;
