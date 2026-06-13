import { z } from 'zod';

const EnvSchema = z.object({
	NODE_ENV: z
		.enum(['development', 'production', 'test'])
		.default('development'),
	MONGO_URI: z.string().min(1, 'MONGO_URI is required'),
	MONGO_DATABASE: z.string().min(1, 'MONGO_DATABASE is required'),
	MONGO_APP_NAME: z.string().default(''),
	PORT: z.coerce.number().int().positive().default(3200),
	WHITELISTED_DOMAINS: z.string().default(''),
	CLIENT_URL: z.string().default('http://localhost:3000'),

	// JWT — usar secrets distintos por tipo de token
	JWT_ACCESS_SECRET: z
		.string()
		.default('dev_access_secret_change_in_production'),
	JWT_REFRESH_SECRET: z
		.string()
		.default('dev_refresh_secret_change_in_production'),
	JWT_EMAIL_SECRET: z.string().default('dev_email_secret_change_in_production'),
	JWT_ACCESS_EXPIRES: z.string().default('15m'),
	JWT_REFRESH_EXPIRES: z.string().default('7d'),
	JWT_EMAIL_EXPIRES: z.string().default('24h'),
	JWT_RESET_EXPIRES: z.string().default('1h'),

	// Email (opcionales — en dev se usa Ethereal automáticamente)
	EMAIL_HOST: z.string().optional(),
	EMAIL_PORT: z.coerce.number().default(587),
	EMAIL_USER: z.string().optional(),
	EMAIL_PASS: z.string().optional(),
	EMAIL_FROM: z.string().default('noreply@first-backend.com'),

	// DNS — public resolvers as fallback for MongoDB Atlas SRV in some environments
	DNS_SERVERS: z.string().default('8.8.8.8,1.1.1.1'),

	// Storage
	STORAGE_DRIVER: z
		.enum(['vercel-blob', 's3', 'gcs', 'azure-blob'])
		.default('vercel-blob'),
	STORAGE_MAX_FILE_SIZE_BYTES: z.coerce.number().default(10 * 1024 * 1024),
	// Cap for inline images on create/update endpoints. Lower than the generic
	// file limit because the request is proxied through serverless functions
	// (Vercel body limit ~4.5 MB).
	STORAGE_MAX_IMAGE_SIZE_BYTES: z.coerce.number().default(4 * 1024 * 1024),
	STORAGE_MAX_FILES_BULK: z.coerce.number().int().min(1).max(20).default(10),

	// Storage — Vercel Blob
	BLOB_READ_WRITE_TOKEN: z.string().optional(),

	// Storage — AWS S3
	AWS_ACCESS_KEY_ID: z.string().optional(),
	AWS_SECRET_ACCESS_KEY: z.string().optional(),
	AWS_REGION: z.string().optional(),
	AWS_S3_BUCKET: z.string().optional(),

	// Storage — Google Cloud Storage (GCS_CREDENTIALS: base64-encoded service-account JSON)
	GCS_BUCKET: z.string().optional(),
	GCS_CREDENTIALS: z.string().optional(),

	// Storage — Azure Blob Storage
	AZURE_STORAGE_CONNECTION_STRING: z.string().optional(),
	AZURE_STORAGE_CONTAINER: z.string().optional(),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
	// eslint-disable-next-line no-console
	console.error('[ENV] Missing or invalid environment variables:');
	const fieldErrors = parsed.error.flatten(
		(issue) => issue.message,
	).fieldErrors;
	Object.entries(fieldErrors).forEach(([key, messages]) => {
		// eslint-disable-next-line no-console
		console.error(`  ${key}: ${messages?.join(', ')}`);
	});
	process.exit(1);
}

export const ENV = parsed.data;

if (ENV.NODE_ENV === 'production') {
	const insecureDefaults = new Set([
		'dev_access_secret_change_in_production',
		'dev_refresh_secret_change_in_production',
		'dev_email_secret_change_in_production',
	]);
	if (
		insecureDefaults.has(ENV.JWT_ACCESS_SECRET) ||
		insecureDefaults.has(ENV.JWT_REFRESH_SECRET)
	) {
		// eslint-disable-next-line no-console
		console.error('[ENV] FATAL: JWT secrets must be changed in production');
		process.exit(1);
	}
}

export const ENVIRONMENT = ENV.NODE_ENV;
export const MONGO_URI = ENV.MONGO_URI;
export const MONGO_DATABASE = ENV.MONGO_DATABASE;
export const MONGO_APP_NAME = ENV.MONGO_APP_NAME;
export const PORT = ENV.PORT;
export const WHITELISTED_DOMAINS = ENV.WHITELISTED_DOMAINS;

const configEnvironment = {
	PORT: ENV.PORT,
	ENVIRONMENT: ENV.NODE_ENV,
	MONGO_URI: ENV.MONGO_URI,
	MONGO_DATABASE: ENV.MONGO_DATABASE,
	MONGO_APP_NAME: ENV.MONGO_APP_NAME,
	WHITELISTED_DOMAINS: ENV.WHITELISTED_DOMAINS,
} as const;

export default configEnvironment;
