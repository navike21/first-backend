import { handleServerShutdown, startServer } from '@Config/mainServer';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import express from 'express';
import { globalLimiter } from '@Config/limiter';

const app = express();

// Middleware
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
	compression({
		threshold: 1024,
	}),
);

app.use(
	helmet({
		contentSecurityPolicy: false,
		crossOriginEmbedderPolicy: false,
		frameguard: { action: 'deny' },
		referrerPolicy: { policy: 'no-referrer' },
		hidePoweredBy: true,
		noSniff: true,
	}),
);

app.use(globalLimiter);

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
