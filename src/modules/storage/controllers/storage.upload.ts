import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import setThrowError from '@Helpers/setThrowError';
import { uploadFile } from '../application/uploadFile';
import {
	StorageUploadBodySchema,
	type StorageUploadBody,
} from '../schemas/storage.schema';

export const storageUploadController = asyncHandler(async (req, res) => {
	if (!req.file) {
		setThrowError({
			statusCode: 400,
			code: 'FILE_REQUIRED',
			message: 'No file was provided',
		});
	}

	const parsed = StorageUploadBodySchema.safeParse(req.body);
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

	const body = parsed.data as StorageUploadBody;
	const result = await uploadFile({
		buffer: req.file!.buffer,
		originalName: req.file!.originalname,
		mimeType: req.file!.mimetype,
		entityType: body.entityType,
		entityId: body.entityId,
		quality: body.quality,
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
		setThrowError({
			statusCode: 400,
			code: 'FILE_REQUIRED',
			message: 'No files were provided',
		});
	}

	const parsed = StorageUploadBodySchema.safeParse(req.body);
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

	const body = parsed.data as StorageUploadBody;
	const results = await Promise.all(
		files!.map((file) =>
			uploadFile({
				buffer: file.buffer,
				originalName: file.originalname,
				mimeType: file.mimetype,
				entityType: body.entityType,
				entityId: body.entityId,
				quality: body.quality,
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
