import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { deleteFilesPermanent } from '../application/deleteFilesPermanent';
import { StorageDeleteSchema } from '../schemas/storage.schema';

export const storageDeletePermanentController = asyncHandler(
	async (req, res) => {
		const validated = validate(StorageDeleteSchema, req.body);

		await deleteFilesPermanent(validated.ids);

		successResponse(res, {
			statusCode: 200,
			code: 'SUCCESS_STORAGE_PERMANENTLY_DELETED',
			message: 'SUCCESS_STORAGE_PERMANENTLY_DELETED',
			ns: 'storage',
			data: null,
		});
	},
);
