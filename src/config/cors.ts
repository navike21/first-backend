import cors, { type CorsOptions } from 'cors';
import { logError } from '@Helpers/log';

const whitelistedDomains = process.env.WHITELISTED_DOMAINS
	? process.env.WHITELISTED_DOMAINS.split(',').map((domain) => domain.trim())
	: [];

export const corsOptions: CorsOptions = {
	origin(origin, callback) {
		// permitir herramientas como Postman / curl
		if (!origin) return callback(null, true);

		if (whitelistedDomains.includes(origin)) {
			return callback(null, true);
		}

		logError(`CORS blocked origin: ${origin}`);
		return callback(new Error('CORS policy: Not allowed by origin'));
	},

	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	optionsSuccessStatus: 204,
};

export const corsConfig = cors(corsOptions);
