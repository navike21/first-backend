import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { getUploadedFile } from '@Helpers/multipartRequest';
// acceptImage('image') populates req.file via multer; getUploadedFile reads req.file
import { uploadEditorImage } from '../application/uploadEditorImage';

export const storageEditorImageController = asyncHandler(async (req, res) => {
	const file = getUploadedFile(req);
	const result = await uploadEditorImage(
		file,
		res.locals.userId as string | undefined,
	);
	successResponse(res, {
		statusCode: 201,
		code: 'SUCCESS_EDITOR_IMAGE_UPLOADED',
		message: 'SUCCESS_EDITOR_IMAGE_UPLOADED',
		ns: 'storage',
		data: result.data,
		warnings: result.warnings,
	});
});
