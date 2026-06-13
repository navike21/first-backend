import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { deleteFilesLogical } from '../application/deleteFilesLogical';
import { StorageDeleteSchema } from '../schemas/storage.schema';

export const storageDeleteController = asyncHandler(async (req, res) => {
	const validated = validate(StorageDeleteSchema, req.body);

	await deleteFilesLogical(validated.ids);

	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_STORAGE_SOFT_DELETED',
		message: 'SUCCESS_STORAGE_SOFT_DELETED',
		ns: 'storage',
		data: null,
	});
});
