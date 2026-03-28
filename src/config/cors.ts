import { logError } from '@Helpers/log';
import cors, { type CorsOptions } from 'cors';

/**
 * CORS configuration to allow requests only from whitelisted domains.
 * The list of allowed domains is read from the WHITELISTED_DOMAINS environment variable,
 * which should be a comma-separated string of domain names.
 *
 * If a request's origin is not in the whitelist, it will be blocked and an error will be logged.
 * Requests without an origin (e.g., from Postman or curl) are allowed by default.
 * The configuration also allows credentials and specifies the allowed HTTP methods and headers.
 * The optionsSuccessStatus is set to 204 to ensure that preflight requests receive a successful response without content.
 * @example
 * WHITELISTED_DOMAINS=http://example.com,http://anotherdomain.com
 * This will allow requests from http://example.com and http://anotherdomain.com, but block requests from any other origins.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS for more information on CORS.
 * @see https://expressjs.com/en/resources/middleware/cors.html for more information on the Express CORS middleware.
 * @see https://www.npmjs.com/package/cors for more information on the CORS package used in this project.
 *
 */

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
