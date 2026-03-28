import { disconnectFromDatabase } from '@Connection/connectionDB';
import { Server } from 'node:http';
import type { Express } from 'express';
import { logError, logInfo } from '@Helpers/log';
import configEnvironment from '@Constants/environments';
import { configApp } from './app';
import { errorMiddleware } from '@Middlewares/errorMiddleware';
import { dbConnectedMiddleware } from '@Middlewares/dbConnected';

let server: Server;
let isShuttingDown = false;

export async function startServer(app: Express): Promise<void> {
	try {
		configApp(app);
		app.use(dbConnectedMiddleware);

		// app.use(mainRouter());
		app.use(errorMiddleware);

		server = app.listen(configEnvironment.PORT, () => {
			logInfo(
				`Server is running on port ${configEnvironment.PORT} in ${configEnvironment.PORT} mode.`,
			);
		});
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
