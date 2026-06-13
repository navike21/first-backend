import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { listStorageFiles } from '../application/listStorageFiles';
import { StorageListQuerySchema } from '../schemas/storage.schema';

export const storageListController = asyncHandler(async (req, res) => {
	const validated = validate(StorageListQuerySchema, req.query);

	const result = await listStorageFiles(validated);

	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_STORAGE_LIST',
		message: 'SUCCESS_STORAGE_LIST',
		ns: 'storage',
		data: result,
	});
});
