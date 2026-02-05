/**
 * @copyright Copyright navike21
 * @license Apache-2.0
 */

import express from 'express';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import { corsConfig } from './cors';
import limiter from './limiter';

export const app = express();

export function configureApp() {
	app.use(corsConfig);
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(cookieParser());
	app.use(
		compression({
			threshold: 1024,
		}),
	);
	app.use(helmet());
	app.use(limiter);
}
