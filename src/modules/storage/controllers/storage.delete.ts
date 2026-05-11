import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import setThrowError from '@Helpers/setThrowError';
import { deleteFiles } from '../application/deleteFiles';
import { StorageDeleteSchema } from '../schemas/storage.schema';

export const storageDeleteController = asyncHandler(async (req, res) => {
	const parsed = StorageDeleteSchema.safeParse(req.body);
	if (!parsed.success) {
		setThrowError({
			statusCode: 422,
			code: 'VALIDATION_SCHEMA_ERROR',
			message: 'Validation failed',
			details: parsed.error.issues.map((i) => ({
				path: i.path.join('.'),
				message: i.message,
			})),
		});
	}

	await deleteFiles(parsed.data!.urls);

	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_STORAGE_DELETED',
		message: 'SUCCESS_STORAGE_DELETED',
		ns: 'storage',
		data: null,
	});
});
