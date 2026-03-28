import { logError, logInfo } from '@Helpers/log';
import cors, { type CorsOptions } from 'cors';

const isDevelopment = process.env.NODE_ENV === 'development';

const whitelistedDomains = process.env.WHITELISTED_DOMAINS
	? process.env.WHITELISTED_DOMAINS.split(',').map((domain) => domain.trim())
	: [];

export const corsOptions: CorsOptions = {
	origin(origin, callback) {
		// En desarrollo, permitir peticiones sin origin (Postman, Thunder Client, etc.)
		if (!origin) {
			if (isDevelopment) {
				logInfo('CORS: Request without origin allowed (development mode)');
				return callback(null, true);
			}
			// En producción, rechazar peticiones sin origin por seguridad
			logError('CORS: Request without origin blocked (production mode)');
			return callback(new Error('CORS policy: Origin required'));
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
