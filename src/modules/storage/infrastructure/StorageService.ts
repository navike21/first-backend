import { ENV } from '@Constants/environments';
import setThrowError from '@Helpers/setThrowError';
import type { StorageDriver } from '../domain/StorageDriver';
import { STORAGE_ERRORS } from '../domain/errors/StorageErrors';
import { VercelBlobDriver } from './drivers/VercelBlobDriver';

export function getStorageDriver(): StorageDriver {
	if (ENV.STORAGE_DRIVER === 'vercel-blob') {
		return new VercelBlobDriver();
	}
	setThrowError({
		statusCode: 500,
		code: STORAGE_ERRORS.DRIVER_NOT_CONFIGURED,
		message: `Unknown storage driver: ${ENV.STORAGE_DRIVER}`,
	});
}
