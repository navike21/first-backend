import compression from 'compression';
import cookieParser from 'cookie-parser';
import express, { type Express } from 'express';
import helmet from 'helmet';
import { corsConfig } from './cors';
import { globalLimiter } from './limiter';

export const configApp = (app: Express) => {
	app.use(express.json());

	app.use(corsConfig);

	app.use(express.urlencoded({ extended: true }));

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
