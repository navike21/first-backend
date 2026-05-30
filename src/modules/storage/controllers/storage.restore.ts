import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { restoreStorageFile } from '../application/restoreStorageFile';

export const storageRestoreController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await restoreStorageFile(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_STORAGE_RESTORED',
		message: 'SUCCESS_STORAGE_RESTORED',
		ns: 'storage',
		data,
	});
});
