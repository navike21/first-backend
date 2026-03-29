import { logError, logInfo } from '@Helpers/log';
import cors, { type CorsOptions } from 'cors';

const whitelistedDomains = process.env.WHITELISTED_DOMAINS
	? process.env.WHITELISTED_DOMAINS.split(',').map((domain) => domain.trim())
	: [];

export const corsOptions: CorsOptions = {
	origin(origin, callback) {
		// Permitir peticiones sin origin (Server-Side, Postman, etc.)
		if (!origin) {
			logInfo('CORS: Request without origin allowed');
			return callback(null, true);
		}

		// Si hay origin, validar contra whitelist
		if (whitelistedDomains.length === 0) {
			// Si no hay whitelist configurada, permitir todos los origins
			logInfo(`CORS: No whitelist configured, allowing origin: ${origin}`);
			return callback(null, true);
		}

		if (whitelistedDomains.includes(origin)) {
			return callback(null, true);
		}

		logError(`CORS blocked origin: ${origin}`);
		return callback(new Error('CORS policy: Not allowed by origin'));
	},

	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
	allowedHeaders: [
		'Content-Type',
		'Authorization',
		'X-Requested-With',
		'Accept',
		'Origin',
	],
	exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
	maxAge: 86400, // 24 horas - cachea la respuesta preflight
	optionsSuccessStatus: 204,
};

export const corsConfig = cors(corsOptions);
