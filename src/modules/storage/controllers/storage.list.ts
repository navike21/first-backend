import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { AppError } from '@Shared/domain/AppError';
import { listStorageFiles } from '../application/listStorageFiles';
import { StorageListQuerySchema } from '../schemas/storage.schema';

export const storageListController = asyncHandler(async (req, res) => {
	const parsed = StorageListQuerySchema.safeParse(req.query);
	if (!parsed.success) {
		AppError.unprocessable('VALIDATION_SCHEMA_ERROR', 'Validation failed', parsed.error.issues.map((i) => ({
			path: i.path.join('.'),
			message: i.message,
		})));
	}

	const result = await listStorageFiles(parsed.data);

	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_STORAGE_LIST',
		message: 'SUCCESS_STORAGE_LIST',
		ns: 'storage',
		data: result,
	});
});
