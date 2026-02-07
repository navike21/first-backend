import mainRouter from '@Routes/route';
import {
	connectToDatabase,
	disconnectFromDatabase,
} from '@Connection/dataBase';
import { logError, logInfo } from 'src/libs/helpers/log';
import { app } from './app';
import configEnvironment from './environments';
import { errorMiddleware } from '@Middlewares/errorMiddleware';

export async function startServer(): Promise<void> {
	try {
		await connectToDatabase();

		app.use(mainRouter());
		app.use(errorMiddleware);

		app.listen(configEnvironment.PORT, () => {
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
	try {
		logInfo('Shutting down server gracefully...');
		await disconnectFromDatabase();
		process.exit(0);
	} catch (error) {
		logError(`Error during server shutdown: ${error as Error}`);
		process.exit(1);
	}
}
