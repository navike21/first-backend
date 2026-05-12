import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import setThrowError from '@Helpers/setThrowError';
import { deleteFilesPermanent } from '../application/deleteFilesPermanent';
import { StorageDeleteSchema } from '../schemas/storage.schema';

export const storageDeletePermanentController = asyncHandler(
	async (req, res) => {
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

		await deleteFilesPermanent(parsed.data!.ids);

		successResponse(res, {
			statusCode: 200,
			code: 'SUCCESS_STORAGE_PERMANENTLY_DELETED',
			message: 'SUCCESS_STORAGE_PERMANENTLY_DELETED',
			ns: 'storage',
			data: null,
		});
	},
);
