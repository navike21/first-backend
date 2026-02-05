/**
 * @copyright Copyright navike21
 * @license Apache-2.0
 */

import mongoose, { type ConnectOptions } from 'mongoose';

import configEnvironment from './environments';
import { logError, logInfo } from '@Helpers/log';

const mongoOptions: ConnectOptions = {
	dbName: configEnvironment.MONGO_DATABASE,
	appName: configEnvironment.MONGO_APP_NAME,
	serverApi: {
		version: '1',
		strict: true,
		deprecationErrors: true,
	},
};

export const connectToDatabase = async (): Promise<void> => {
	if (!configEnvironment.MONGO_URI) {
		logError('MONGO_URI is not defined in environment variables.');
		throw new Error('MONGO_URI is not defined.');
	}
	try {
		await mongoose.connect(configEnvironment.MONGO_URI, mongoOptions);
		logInfo('Connected to MongoDB database successfully.');
	} catch (error) {
		logError(`Database connection error: ${error as Error}`);
		throw error;
	}
};

export const disconnectFromDatabase = async (): Promise<void> => {
	try {
		await mongoose.disconnect();
		logInfo('Disconnected from MongoDB database successfully.');
	} catch (error) {
		logError(`Database disconnection error: ${error as Error}`);
		throw error;
	}
};
