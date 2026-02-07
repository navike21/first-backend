import rateLimit from 'express-rate-limit';

export const globalLimiter = rateLimit({
	windowMs: 60_000,
	max: 100,
	standardHeaders: 'draft-8',
	legacyHeaders: false,
	message: {
		success: false,
		statusCode: 429,
		message: 'Too many requests, please try again later.',
	},
});

export const authLimiter = rateLimit({
	windowMs: 60_000,
	max: 5,
	message: {
		success: false,
		statusCode: 429,
		message: 'Too many login attempts.',
	},
});
