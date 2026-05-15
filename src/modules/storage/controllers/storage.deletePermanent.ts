import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { AppError } from '@Shared/domain/AppError';
import { deleteFilesPermanent } from '../application/deleteFilesPermanent';
import { StorageDeleteSchema } from '../schemas/storage.schema';

export const storageDeletePermanentController = asyncHandler(
	async (req, res) => {
		const parsed = StorageDeleteSchema.safeParse(req.body);
		if (!parsed.success) {
			AppError.unprocessable('VALIDATION_SCHEMA_ERROR', 'Validation failed', parsed.error.issues.map((i) => ({
				path: i.path.join('.'),
				message: i.message,
			})));
		}

		await deleteFilesPermanent(parsed.data.ids);

		successResponse(res, {
			statusCode: 200,
			code: 'SUCCESS_STORAGE_PERMANENTLY_DELETED',
			message: 'SUCCESS_STORAGE_PERMANENTLY_DELETED',
			ns: 'storage',
			data: null,
		});
	},
);
