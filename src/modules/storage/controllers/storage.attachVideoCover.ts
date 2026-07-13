import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { getUploadedFile } from '@Helpers/multipartRequest';
import { attachVideoCover } from '../application/attachVideoCover';

export const storageAttachVideoCoverController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const file = getUploadedFile(req);
	const data = await attachVideoCover(id, file);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_STORAGE_COVER_ATTACHED',
		message: 'SUCCESS_STORAGE_COVER_ATTACHED',
		ns: 'storage',
		data,
	});
});
