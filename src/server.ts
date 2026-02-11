import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';

import mainRouter from '@Routes/route';
import { errorMiddleware } from '@Middlewares/errorMiddleware';
import { corsConfig } from '@Config/cors';
import { globalLimiter } from '@Config/limiter';
import { dbConnectedMiddleware } from '@Middlewares/dbConnected';

const app = express();

app.use(corsConfig);

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

app.use(dbConnectedMiddleware);
app.use(mainRouter());

app.use(errorMiddleware);

export default app;
