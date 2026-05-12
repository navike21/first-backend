import { ENV } from '@Constants/environments';
import setThrowError from '@Helpers/setThrowError';
import type { StorageDriver } from '../domain/StorageDriver';
import { STORAGE_ERRORS } from '../domain/errors/StorageErrors';
import { VercelBlobDriver } from './drivers/VercelBlobDriver';
import { S3Driver } from './drivers/S3Driver';
import { GCSDriver } from './drivers/GCSDriver';
import { AzureBlobDriver } from './drivers/AzureBlobDriver';

export function getStorageDriver(): StorageDriver {
	switch (ENV.STORAGE_DRIVER) {
		case 'vercel-blob':
			return new VercelBlobDriver();
		case 's3':
			return new S3Driver();
		case 'gcs':
			return new GCSDriver();
		case 'azure-blob':
			return new AzureBlobDriver();
		default:
			setThrowError({
				statusCode: 500,
				code: STORAGE_ERRORS.DRIVER_NOT_CONFIGURED,
				message: `Unknown storage driver: ${ENV.STORAGE_DRIVER}`,
			});
	}
}
