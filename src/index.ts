import dns from 'node:dns';
import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import {
	handleServerShutdown,
	initializeApp,
	startServer,
} from '@Config/mainServer';

// Node.js c-ares no resuelve servidores DNS IPv6 link-local (fe80::x) en Windows.
// Necesario para que el SRV lookup de MongoDB Atlas funcione correctamente.
dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = express();

if (process.env.VERCEL) {
	// Serverless: initialize once, queue requests until ready
	const initPromise = initializeApp(app);
	app.use((_req: Request, _res: Response, next: NextFunction) => {
		initPromise.then(() => next()).catch(next);
	});
} else {
	startServer(app);
	process.on('SIGINT', handleServerShutdown);
	process.on('SIGTERM', handleServerShutdown);
}

export default app;
