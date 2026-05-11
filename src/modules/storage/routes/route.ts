import type { Router } from 'express';
import { ENV } from '@Constants/environments';
import { PERMISSIONS } from '@Constants/permissions';
import { authenticate, authorize } from '@Modules/auth';
import { ALL_ALLOWED_MIME_TYPES } from '../constants/allowedMimeTypes';
import {
	STORAGE_PATH_DELETE,
	STORAGE_PATH_UPLOAD,
	STORAGE_PATH_UPLOAD_BULK,
} from '../constants/paths';
import {
	storageUploadBulkController,
	storageUploadController,
} from '../controllers/storage.upload';
import { storageDeleteController } from '../controllers/storage.delete';
import { createMulterArray, createMulterSingle } from '../middlewares/multerUpload';
import { validateFileType } from '../middlewares/validateFileType';
import { captureAudit, AUDIT_ACTIONS } from '@Modules/audit-log';

export function storageApi(router: Router) {
	const multerSingle = createMulterSingle(
		'file',
		ENV.STORAGE_MAX_FILE_SIZE_BYTES,
	);
	const multerArray = createMulterArray(
		'files',
		ENV.STORAGE_MAX_FILES_BULK,
		ENV.STORAGE_MAX_FILE_SIZE_BYTES,
	);
	const validateAll = validateFileType({
		allowedMimeTypes: ALL_ALLOWED_MIME_TYPES,
	});
	const validateAllBulk = validateFileType({
		allowedMimeTypes: ALL_ALLOWED_MIME_TYPES,
		field: 'files',
	});

	router.post(
		STORAGE_PATH_UPLOAD,
		authenticate,
		authorize(PERMISSIONS.STORAGE_UPLOAD, PERMISSIONS.STORAGE_MANAGE),
		multerSingle,
		validateAll,
		captureAudit({ action: AUDIT_ACTIONS.STORAGE_UPLOADED, resource: 'storage' }),
		storageUploadController,
	);

	router.post(
		STORAGE_PATH_UPLOAD_BULK,
		authenticate,
		authorize(PERMISSIONS.STORAGE_UPLOAD, PERMISSIONS.STORAGE_MANAGE),
		multerArray,
		validateAllBulk,
		captureAudit({ action: AUDIT_ACTIONS.STORAGE_UPLOADED, resource: 'storage' }),
		storageUploadBulkController,
	);

	router.delete(
		STORAGE_PATH_DELETE,
		authenticate,
		authorize(PERMISSIONS.STORAGE_DELETE, PERMISSIONS.STORAGE_MANAGE),
		captureAudit({ action: AUDIT_ACTIONS.STORAGE_DELETED, resource: 'storage' }),
		storageDeleteController,
	);
}
