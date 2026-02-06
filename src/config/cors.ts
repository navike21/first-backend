import cors, { CorsOptions } from 'cors';

export const corsOptions: CorsOptions = {
	origin(origin, callback) {
		const whitelistedDomains = process.env.WHITELISTED_DOMAINS
			? process.env.WHITELISTED_DOMAINS.split(',').map((domain) =>
					domain.trim(),
				)
			: [];

		if (!origin || whitelistedDomains.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
};

export const corsConfig = cors(corsOptions);
