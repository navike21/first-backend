import mongoose, { type ConnectOptions } from 'mongoose';

import { logError, logInfo } from 'src/libs/helpers/log';
import configEnvironment from '@Config/environments';

const mongoOptions: ConnectOptions = {
	dbName: configEnvironment.MONGO_DATABASE,
	appName: configEnvironment.MONGO_APP_NAME,
	serverApi: {
		version: '1',
		strict: true,
		deprecationErrors: true,
	},
};

export async function connectToDatabase(): Promise<void> {
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
}

export async function disconnectFromDatabase(): Promise<void> {
	try {
		await mongoose.disconnect();
		logInfo('Disconnected from MongoDB database successfully.');
	} catch (error) {
		logError(`Database disconnection error: ${error as Error}`);
		throw error;
	}
}
