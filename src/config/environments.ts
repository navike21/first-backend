/**
 * @copyright Copyright navike21
 * @license Apache-2.0
 */

import dotenv from 'dotenv';

dotenv.config();

const configEnvironment = {
	PORT: process.env.PORT || 3000,
	NODE_ENV: process.env.NODE_ENV || 'development',
	WHITELISTED_DOMAINS: process.env.WHITELISTED_DOMAINS
		? process.env.WHITELISTED_DOMAINS.split(',')
				.map((domain) => domain.trim())
				.filter(Boolean)
		: [],
	MONGO_URI: process.env.MONGO_URI || '',
	MONGO_DATABASE: process.env.MONGO_DATABASE,
	MONGO_APP_NAME: process.env.MONGO_APP_NAME,
};

export default configEnvironment;
