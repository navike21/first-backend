import compression from 'compression';
import cookieParser from 'cookie-parser';
import express, { type Express } from 'express';
import helmet from 'helmet';
import { globalLimiter } from './limiter';

export const configApp = (app: Express) => {
	app.use(express.json());

	app.use(express.urlencoded({ extended: true }));

	app.use(cookieParser());

	app.use(
		compression({
			threshold: 1024,
		}),
	);

	app.use(
		helmet({
			contentSecurityPolicy: false,
			crossOriginEmbedderPolicy: false,
			frameguard: { action: 'deny' },
			referrerPolicy: { policy: 'no-referrer' },
			hidePoweredBy: true,
			noSniff: true,
		}),
	);

	app.use(globalLimiter);
};
