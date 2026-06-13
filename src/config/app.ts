import compression from 'compression';
import cookieParser from 'cookie-parser';
import express, { type Express } from 'express';
import helmet from 'helmet';
import { corsConfig } from './cors';
import { globalLimiter } from './limiter';
import { i18nMiddleware } from '@Middlewares/i18nMiddleware';

export const configApp = (app: Express) => {
	// JSON/urlencoded bodies are small (file uploads use multipart via multer);
	// cap them to limit abuse.
	app.use(express.json({ limit: '1mb' }));

	app.use(corsConfig);

	app.use(i18nMiddleware);

	app.use(express.urlencoded({ extended: true, limit: '1mb' }));

	app.use(cookieParser());

	app.use(
		compression({
			threshold: 1024,
		}),
	);

	app.use(
		helmet({
			contentSecurityPolicy: {
				directives: {
					defaultSrc: ["'self'"],
					styleSrc: ["'self'", "'unsafe-inline'"],
					scriptSrc: ["'self'"],
					imgSrc: ["'self'", 'data:', 'https:'],
				},
			},
			crossOriginEmbedderPolicy: false,
			crossOriginOpenerPolicy: { policy: 'same-origin' },
			crossOriginResourcePolicy: { policy: 'cross-origin' },
			frameguard: { action: 'deny' },
			referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
			hidePoweredBy: true,
			noSniff: true,
			xssFilter: true,
			hsts: {
				maxAge: 31536000, // 1 año
				includeSubDomains: true,
				preload: true,
			},
		}),
	);

	app.use(globalLimiter);
};
