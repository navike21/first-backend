import { ENV } from '@Constants/environments';
import { logError, logInfo } from '@Helpers/log';
import mongoose, { type ConnectOptions } from 'mongoose';

const mongoOptions: ConnectOptions = {
	dbName: ENV.MONGO_DATABASE,
	appName: ENV.MONGO_APP_NAME,
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
	if (mongoose.connection.readyState === 1) {
		logInfo('MongoDB already connected.');
		return;
	}

	try {
		await mongoose.connect(ENV.MONGO_URI, mongoOptions);
		logInfo('Connected to MongoDB successfully.');

		mongoose.connection.on('disconnected', () =>
			logError('MongoDB disconnected.'),
		);
		mongoose.connection.on('reconnected', () =>
			logInfo('MongoDB reconnected.'),
		);
		mongoose.connection.on('error', (err) => logError(`MongoDB error: ${err}`));
	} catch (error) {
		logError(`Database connection error: ${error as Error}`);
		throw error;
	}
}

export async function disconnectFromDatabase(): Promise<void> {
	if (mongoose.connection.readyState === 0) return;

	try {
		await mongoose.disconnect();
		logInfo('Disconnected from MongoDB successfully.');
	} catch (error) {
		logError(`Database disconnection error: ${error as Error}`);
		throw error;
	}
}
