import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import setThrowError from '@Helpers/setThrowError';
import { listStorageFiles } from '../application/listStorageFiles';
import { StorageListQuerySchema } from '../schemas/storage.schema';

export const storageListController = asyncHandler(async (req, res) => {
	const parsed = StorageListQuerySchema.safeParse(req.query);
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

	const result = await listStorageFiles(parsed.data!);

	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_STORAGE_LIST',
		message: 'SUCCESS_STORAGE_LIST',
		ns: 'storage',
		data: result,
	});
});
