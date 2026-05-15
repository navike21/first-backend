import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { AppError } from '@Shared/domain/AppError';
import { deleteFilesLogical } from '../application/deleteFilesLogical';
import { StorageDeleteSchema } from '../schemas/storage.schema';

export const storageDeleteController = asyncHandler(async (req, res) => {
	const parsed = StorageDeleteSchema.safeParse(req.body);
	if (!parsed.success) {
		AppError.unprocessable('VALIDATION_SCHEMA_ERROR', 'Validation failed', parsed.error.issues.map((i) => ({
			path: i.path.join('.'),
			message: i.message,
		})));
	}

	await deleteFilesLogical(parsed.data.ids);

	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_STORAGE_SOFT_DELETED',
		message: 'SUCCESS_STORAGE_SOFT_DELETED',
		ns: 'storage',
		data: null,
	});
});
