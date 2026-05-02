import { z } from 'zod';

const EnvSchema = z.object({
	NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
	MONGO_URI: z.string().min(1, 'MONGO_URI is required'),
	MONGO_DATABASE: z.string().min(1, 'MONGO_DATABASE is required'),
	MONGO_APP_NAME: z.string().default(''),
	PORT: z.coerce.number().int().positive().default(3200),
	JWT_EXPIRES_IN: z.string().default('7d'),
	SECRET_KEY: z.string().default(''),
	WHITELISTED_DOMAINS: z.string().default(''),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
	console.error('[ENV] Missing or invalid environment variables:');
	const fieldErrors = parsed.error.flatten().fieldErrors;
	Object.entries(fieldErrors).forEach(([key, messages]) => {
		console.error(`  ${key}: ${messages?.join(', ')}`);
	});
	process.exit(1);
}

export const ENV = parsed.data;

export const ENVIRONMENT = ENV.NODE_ENV;
export const JWT_EXPIRES_IN = ENV.JWT_EXPIRES_IN;
export const MONGO_URI = ENV.MONGO_URI;
export const MONGO_DATABASE = ENV.MONGO_DATABASE;
export const MONGO_APP_NAME = ENV.MONGO_APP_NAME;
export const PORT = ENV.PORT;
export const SECRET_KEY = ENV.SECRET_KEY;
export const WHITELISTED_DOMAINS = ENV.WHITELISTED_DOMAINS;

const configEnvironment = {
	PORT: ENV.PORT,
	ENVIRONMENT: ENV.NODE_ENV,
	JWT_EXPIRES_IN: ENV.JWT_EXPIRES_IN,
	MONGO_URI: ENV.MONGO_URI,
	MONGO_DATABASE: ENV.MONGO_DATABASE,
	MONGO_APP_NAME: ENV.MONGO_APP_NAME,
	SECRET_KEY: ENV.SECRET_KEY,
	WHITELISTED_DOMAINS: ENV.WHITELISTED_DOMAINS,
} as const;

export default configEnvironment;
