import { beforeAll, afterAll, afterEach } from 'vitest';
import { startMongo, stopMongo, clearMongo } from './mongoSetup';

export function withMongo(): void {
	beforeAll(startMongo);
	afterEach(clearMongo);
	afterAll(stopMongo);
}
