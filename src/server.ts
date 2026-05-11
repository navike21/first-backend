import dns from 'node:dns';
import { Server } from 'node:http';
import express from 'express';
import { initApp, connectToDatabase } from '@Config/mainServer';
import { initSocketServer } from '@Shared/infrastructure/SocketServer';
import { ENV } from '@Constants/environments';
import { logError, logInfo } from '@Helpers/log';

dns.setServers(ENV.DNS_SERVERS.split(','));

const app = express();
let server: Server;
let isShuttingDown = false;

initApp(app)
	.then(() => connectToDatabase())
	.then(() => {
		server = app.listen(ENV.PORT, () => {
			logInfo(`Server running on port ${ENV.PORT} in ${ENV.NODE_ENV} mode.`);
		});
		initSocketServer(server);
		logInfo('Socket.io server initialized.');
	})
	.catch((error) => {
		logError(`Failed to start server: ${error as Error}`);
		process.exit(1);
	});

async function handleServerShutdown() {
	if (isShuttingDown) return;
	isShuttingDown = true;
	logInfo('Shutting down server gracefully...');
	server.close(async () => {
		process.exit(0);
	});
}

process.on('SIGINT', handleServerShutdown);
process.on('SIGTERM', handleServerShutdown);
