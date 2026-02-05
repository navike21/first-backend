/**
 * @copyright Copyright navike21
 * @license Apache-2.0
 */

import router from '@Routes/main';
import { app } from './app';
import { connectToDatabase, disconnectFromDatabase } from './dataBase';
import configEnvironment from './environments';
import { logError, logInfo } from '@Helpers/log';

export const startServer = async () => {
	try {
		await connectToDatabase();
		app.use(router);
		app.listen(configEnvironment.PORT, () => {
			logInfo(
				`Server is running on port ${configEnvironment.PORT} in ${configEnvironment.NODE_ENV} mode.`,
			);
		});
	} catch (error) {
		logError(`Failed to start server: ${error as Error}`);
		process.exit(1);
	}
};

export const handleServerShutdown = async () => {
	try {
		logInfo('Shutting down server gracefully...');
		await disconnectFromDatabase();
		process.exit(0);
	} catch (error) {
		logError(`Error during server shutdown: ${error as Error}`);
		process.exit(1);
	}
};
