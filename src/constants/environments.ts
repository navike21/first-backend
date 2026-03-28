export const ENVIRONMENT = process.env.NODE_ENV ?? 'development';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '7d';
export const MONGO_URI = process.env.MONGO_URI ?? '';
export const MONGO_DATABASE = process.env.MONGO_DATABASE ?? '';
export const MONGO_APP_NAME = process.env.MONGO_APP_NAME ?? '';
export const PORT = process.env.PORT ?? '';
export const SECRET_KEY = process.env.SECRET_KEY ?? '';
export const WHITELISTED_DOMAINS = process.env.WHITELISTED_DOMAINS ?? '';

const configEnvironment = {
	PORT: PORT,
	ENVIRONMENT: ENVIRONMENT,
	JWT_EXPIRES_IN: JWT_EXPIRES_IN,
	MONGO_URI: MONGO_URI,
	MONGO_DATABASE: MONGO_DATABASE,
	MONGO_APP_NAME: MONGO_APP_NAME,
	SECRET_KEY: SECRET_KEY,
	WHITELISTED_DOMAINS: WHITELISTED_DOMAINS,
} as const;

export default configEnvironment;
