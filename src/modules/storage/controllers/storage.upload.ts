import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { AppError } from '@Shared/domain/AppError';
import { uploadFile } from '../application/uploadFile';
import { StorageUploadBodySchema } from '../schemas/storage.schema';

export const storageUploadController = asyncHandler(async (req, res) => {
	if (!req.file) {
		AppError.badRequest('FILE_REQUIRED', 'No file was provided');
	}

	const body = validate(StorageUploadBodySchema, req.body);
	const result = await uploadFile({
		buffer: req.file.buffer,
		originalName: req.file.originalname,
		mimeType: req.file.mimetype,
		entityType: body.entityType,
		entityId: body.entityId,
		quality: body.quality,
		uploadedBy: res.locals.userId as string | undefined,
	});

	successResponse(res, {
		statusCode: 201,
		code: 'SUCCESS_STORAGE_UPLOAD',
		message: 'SUCCESS_STORAGE_UPLOAD',
		ns: 'storage',
		data: result,
	});
});

export const storageUploadBulkController = asyncHandler(async (req, res) => {
	const files = req.files as Express.Multer.File[] | undefined;
	if (!files || files.length === 0) {
		AppError.badRequest('FILE_REQUIRED', 'No files were provided');
	}

	const body = validate(StorageUploadBodySchema, req.body);
	const results = await Promise.all(
		files.map((file) =>
			uploadFile({
				buffer: file.buffer,
				originalName: file.originalname,
				mimeType: file.mimetype,
				entityType: body.entityType,
				entityId: body.entityId,
				quality: body.quality,
				uploadedBy: res.locals.userId as string | undefined,
			}),
		),
	);

	successResponse(res, {
		statusCode: 201,
		code: 'SUCCESS_STORAGE_UPLOAD_BULK',
		message: 'SUCCESS_STORAGE_UPLOAD_BULK',
		ns: 'storage',
		data: results,
	});
});
