import rateLimit from 'express-rate-limit';
import { MongoRateLimitStore } from '@Shared/infrastructure/RateLimitStore';

// MongoRateLimitStore (not the default in-memory store): on Vercel serverless
// each concurrent instance has its own memory, so a MemoryStore lets a client
// spread requests across instances to blow past `max` — especially dangerous
// for authLimiter's brute-force protection. Backed by the same MongoDB the
// app already uses, so no new infra dependency.
export const globalLimiter = rateLimit({
	windowMs: 60_000,
	max: 100,
	standardHeaders: 'draft-8',
	legacyHeaders: false,
	store: new MongoRateLimitStore('global-limiter'),
	message: {
		success: false,
		statusCode: 429,
		message: 'Too many requests, please try again later.',
	},
});

export const authLimiter = rateLimit({
	windowMs: 60_000,
	max: 5,
	store: new MongoRateLimitStore('auth-limiter'),
	message: {
		success: false,
		statusCode: 429,
		message: 'Too many login attempts.',
	},
});
