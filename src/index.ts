import dns from 'node:dns';
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

export const readyPromise: Promise<void> = process.env.VERCEL
	? initializeApp(app)
	: (() => {
			startServer(app);
			process.on('SIGINT', handleServerShutdown);
			process.on('SIGTERM', handleServerShutdown);
			return Promise.resolve();
		})();

export default app;
