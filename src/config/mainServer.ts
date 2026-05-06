import { Server } from 'node:http';
import type { Express } from 'express';
import { configApp } from './app';
import {
	connectToDatabase,
	disconnectFromDatabase,
} from '@Connection/connectionDB';
import { logError, logInfo } from '@Helpers/log';
import { ENV } from '@Constants/environments';
import { initI18n } from './i18n';
import { initSocketServer } from '@Shared/infrastructure/SocketServer';
import mainRouter from '@Routes/routes';
import { errorMiddleware } from '@Middlewares/errorMiddleware';

let server: Server;
let isShuttingDown = false;

export async function initializeApp(app: Express): Promise<void> {
	await initI18n();
	await connectToDatabase();

	configApp(app);
	app.use(mainRouter());
	app.use(errorMiddleware);
}

export async function startServer(app: Express): Promise<void> {
	try {
		await initializeApp(app);

		server = app.listen(ENV.PORT, () => {
			logInfo(`Server running on port ${ENV.PORT} in ${ENV.NODE_ENV} mode.`);
		});

		initSocketServer(server);
		logInfo('Socket.io server initialized.');
	} catch (error) {
		logError(`Failed to start server: ${error as Error}`);
		process.exit(1);
	}
}

export async function handleServerShutdown(): Promise<void> {
	if (isShuttingDown) return;
	isShuttingDown = true;

	logInfo('Shutting down server gracefully...');

	server.close(async () => {
		try {
			await disconnectFromDatabase();
			process.exit(0);
		} catch (error) {
			logError(`Error during server shutdown: ${error as Error}`);
			process.exit(1);
		}
	});
}
