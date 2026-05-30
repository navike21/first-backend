import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { listDeletedStorageFiles } from '../application/listDeletedStorageFiles';

export const storageTrashController = asyncHandler(async (req, res) => {
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 20;
	const result = await listDeletedStorageFiles({ page, limit });
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_STORAGE_TRASH_LIST',
		message: 'SUCCESS_STORAGE_TRASH_LIST',
		ns: 'storage',
		data: result,
	});
});
