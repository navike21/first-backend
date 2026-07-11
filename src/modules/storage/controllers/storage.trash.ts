import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { listDeletedStorageFiles } from '../application/listDeletedStorageFiles';
import { StorageListQuerySchema } from '../schemas/storage.schema';

export const storageTrashController = asyncHandler(async (req, res) => {
	const validated = validate(StorageListQuerySchema, req.query);
	const result = await listDeletedStorageFiles(validated);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_STORAGE_TRASH_LIST',
		message: 'SUCCESS_STORAGE_TRASH_LIST',
		ns: 'storage',
		data: result,
	});
});
