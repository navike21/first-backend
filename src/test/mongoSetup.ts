import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryServer;

export async function startMongo(): Promise<void> {
	mongoServer = await MongoMemoryServer.create();
	const uri = mongoServer.getUri();
	await mongoose.connect(uri);
}

export async function stopMongo(): Promise<void> {
	await mongoose.disconnect();
	if (mongoServer) await mongoServer.stop();
}

export async function clearMongo(): Promise<void> {
	if (mongoose.connection.readyState !== 1) return;
	const collections = mongoose.connection.collections;
	for (const key in collections) {
		await collections[key].deleteMany({});
	}
}
