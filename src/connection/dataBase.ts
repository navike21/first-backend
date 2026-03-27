import mongoose, { type ConnectOptions } from 'mongoose';

import { logError, logInfo } from '@Helpers/log';
import configEnvironment from '@Config/environments';

let isConnected = false;

const mongoOptions: ConnectOptions = {
	dbName: configEnvironment.MONGO_DATABASE,
	appName: configEnvironment.MONGO_APP_NAME,
	maxPoolSize: 10,
	serverSelectionTimeoutMS: 5000,
	socketTimeoutMS: 45000,
	serverApi: {
		version: '1',
		strict: true,
		deprecationErrors: true,
	},
};

export async function connectToDatabase(): Promise<void> {
	if (isConnected) {
		logInfo('MongoDB already connected.');
		return;
	}

	if (!configEnvironment.MONGO_URI) {
		logError('MONGO_URI is not defined in environment variables.');
		throw new Error('MONGO_URI is not defined.');
	}

	try {
		await mongoose.connect(configEnvironment.MONGO_URI, mongoOptions);
		isConnected = true;
		logInfo('Connected to MongoDB successfully.');
	} catch (error) {
		logError(`Database connection error: ${error as Error}`);
		throw error;
	}
}

export async function disconnectFromDatabase(): Promise<void> {
	if (!isConnected) return;

	try {
		await mongoose.disconnect();
		isConnected = false;
		logInfo('Disconnected from MongoDB successfully.');
	} catch (error) {
		logError(`Database disconnection error: ${error as Error}`);
		throw error;
	}
}
