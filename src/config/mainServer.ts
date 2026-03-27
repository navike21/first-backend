import mainRouter from '@Routes/route';
import {
	connectToDatabase,
	disconnectFromDatabase,
} from '@Connection/dataBase';
import { logError, logInfo } from '@Helpers/log';

import configEnvironment from './environments';
import { errorMiddleware } from '@Middlewares/errorMiddleware';
import type { Server } from 'node:http';
import express from 'express';

const app = express();

let server: Server;
let isShuttingDown = false;

export async function startServer(): Promise<void> {
	try {
		await connectToDatabase();

		app.use(mainRouter());
		app.use(errorMiddleware);

		server = app.listen(configEnvironment.PORT, () => {
			logInfo(
				`Server is running on port ${configEnvironment.PORT} in ${configEnvironment.NODE_ENV} mode.`,
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
