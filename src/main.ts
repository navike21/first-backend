import configEnvironment from '@Config/environments';
import express from 'express';

// import helmet from 'helmet';
// import cookieParser from 'cookie-parser';
// import compression from 'compression';

// import mainRouter from '@Routes/route';
// import { errorMiddleware } from '@Middlewares/errorMiddleware';
// import { corsConfig } from '@Config/cors';
// import { globalLimiter } from '@Config/limiter';
// import { dbConnectedMiddleware } from '@Middlewares/dbConnected';

const app = express();
// // Trust proxy for Vercel / reverse proxies
// app.set('trust proxy', 1);

// app.use(corsConfig);

// app.use(express.json());

// app.use(express.urlencoded({ extended: true }));

// app.use(cookieParser());

// app.use(
// 	compression({
// 		threshold: 1024,
// 	}),
// );

// app.use(
// 	helmet({
// 		contentSecurityPolicy: false,
// 		crossOriginEmbedderPolicy: false,
// 		frameguard: { action: 'deny' },
// 		referrerPolicy: { policy: 'no-referrer' },
// 		hidePoweredBy: true,
// 		noSniff: true,
// 	}),
// );

// app.use(globalLimiter);

// app.use(dbConnectedMiddleware);
// app.use(mainRouter());

// app.use(errorMiddleware);

// export { app };
// export default app;

app.use(express.json());

// corsConfig();
// connectDataBase();

app.get('/', (req, res) => {
	res.send(`Hello World! ${configEnvironment.PORT}`);
});

app.listen(configEnvironment.PORT, () => {
	console.log(`Server running on port ${configEnvironment.PORT}`);
});

// app.use(validateRequest);

// app.use('/', routers());
