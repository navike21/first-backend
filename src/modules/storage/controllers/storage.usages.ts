import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { AppError } from '@Shared/domain/AppError';
import StorageFileModel from '../infrastructure/StorageFileModel';
import { STORAGE_ERRORS } from '../domain/errors/StorageErrors';
import { findStorageFileUsages } from '../application/findStorageFileUsages';

export const storageUsagesController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const file = await StorageFileModel.findOne({ id }).lean();
	if (!file) AppError.notFound(STORAGE_ERRORS.FILE_NOT_FOUND, 'File not found');

	const url = file.full?.url ?? file.original.url;
	const data = await findStorageFileUsages(url);

	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_STORAGE_USAGES',
		message: 'SUCCESS_STORAGE_USAGES',
		ns: 'storage',
		data,
	});
});
