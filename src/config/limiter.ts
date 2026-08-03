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

// Public form submissions are more spam-prone than the subscribe form
// (arbitrary admin-defined forms, no CAPTCHA yet) — stricter than
// globalLimiter, per-IP.
export const formSubmissionLimiter = rateLimit({
	windowMs: 60_000,
	max: 10,
	store: new MongoRateLimitStore('form-submission-limiter'),
	message: {
		success: false,
		statusCode: 429,
		message: 'Too many form submissions, please try again later.',
	},
});

// Each call is a real (paid) Anthropic API request, so this is keyed by
// authenticated user, not IP (unlike every other limiter here) — the real
// cost risk is one admin's account being clicked many times in a row, not
// distinct IPs sharing a budget. Runs after `authenticate` on every route
// that uses it, so `res.locals.userId` is always set by the time this reads
// it. `max: 10` is generous for an editor working through the 9 non-source
// languages of one record, but bounds accidental repeated clicking.
export const translationAssistLimiter = rateLimit({
	windowMs: 60_000,
	max: 10,
	store: new MongoRateLimitStore('translation-assist-limiter'),
	keyGenerator: (_req, res) => res.locals.userId as string,
	message: {
		success: false,
		statusCode: 429,
		message: 'Too many translation suggestions, please slow down.',
	},
});
