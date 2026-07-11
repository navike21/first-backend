import type { Router } from 'express';
import { ENV } from '@Constants/environments';
import { PERMISSIONS } from '@Constants/permissions';
import { authenticate, authorize } from '@Modules/auth';
import { ALL_ALLOWED_MIME_TYPES } from '../constants/allowedMimeTypes';
import {
	STORAGE_PATH_DELETE,
	STORAGE_PATH_DELETE_PERMANENT,
	STORAGE_PATH_DIRECT_UPLOAD,
	STORAGE_PATH_EDITOR_IMAGE,
	STORAGE_PATH_FILES,
	STORAGE_PATH_RESTORE,
	STORAGE_PATH_TRASH,
	STORAGE_PATH_UPLOAD,
	STORAGE_PATH_UPLOAD_BULK,
	STORAGE_PATH_BULK_RESTORE,
} from '../constants/paths';
import {
	storageUploadBulkController,
	storageUploadController,
} from '../controllers/storage.upload';
import { storageEditorImageController } from '../controllers/storage.editorImage';
import { storageDirectUploadController } from '../controllers/storage.directUpload';
import { storageDeleteController } from '../controllers/storage.delete';
import { storageDeletePermanentController } from '../controllers/storage.deletePermanent';
import { storageListController } from '../controllers/storage.list';
import { storageRestoreController } from '../controllers/storage.restore';
import { storageTrashController } from '../controllers/storage.trash';
import { storageRestoreBulkController } from '../controllers/storage.restoreBulk';
import {
	createMulterArray,
	createMulterSingle,
} from '../middlewares/multerUpload';
import { validateFileType } from '../middlewares/validateFileType';
import { acceptImage } from '../middlewares/acceptImage';
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
		STORAGE_PATH_EDITOR_IMAGE,
		authenticate,
		...acceptImage('image'),
		storageEditorImageController,
	);

	// No `authenticate` here on purpose: this single route serves both the
	// authenticated browser (token request — checked manually inside the
	// controller/use-case) AND Vercel's own upload-completed webhook callback
	// (verified internally by handleUpload, never carries our JWT). See
	// application/directUpload.ts.
	router.post(STORAGE_PATH_DIRECT_UPLOAD, storageDirectUploadController);

	router.post(
		STORAGE_PATH_UPLOAD,
		authenticate,
		authorize(PERMISSIONS.STORAGE_UPLOAD, PERMISSIONS.STORAGE_MANAGE),
		multerSingle,
		validateAll,
		captureAudit({
			action: AUDIT_ACTIONS.STORAGE_UPLOADED,
			resource: 'storage',
		}),
		storageUploadController,
	);

	router.post(
		STORAGE_PATH_UPLOAD_BULK,
		authenticate,
		authorize(PERMISSIONS.STORAGE_UPLOAD, PERMISSIONS.STORAGE_MANAGE),
		multerArray,
		validateAllBulk,
		captureAudit({
			action: AUDIT_ACTIONS.STORAGE_UPLOADED,
			resource: 'storage',
		}),
		storageUploadBulkController,
	);

	router.get(
		STORAGE_PATH_TRASH,
		authenticate,
		authorize(PERMISSIONS.STORAGE_READ, PERMISSIONS.STORAGE_MANAGE),
		storageTrashController,
	);
	router.get(
		STORAGE_PATH_FILES,
		authenticate,
		authorize(PERMISSIONS.STORAGE_READ, PERMISSIONS.STORAGE_MANAGE),
		storageListController,
	);

	router.patch(
		STORAGE_PATH_RESTORE,
		authenticate,
		authorize(PERMISSIONS.STORAGE_UPDATE, PERMISSIONS.STORAGE_MANAGE),
		captureAudit({ action: AUDIT_ACTIONS.STORAGE_RESTORED, resource: 'storage' }),
		storageRestoreController,
	);

	// Bulk restore
	router.patch(
		STORAGE_PATH_BULK_RESTORE,
		authenticate,
		authorize(PERMISSIONS.STORAGE_UPDATE, PERMISSIONS.STORAGE_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.STORAGE_BULK_RESTORED,
			resource: 'storage',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		storageRestoreBulkController,
	);

	router.delete(
		STORAGE_PATH_DELETE_PERMANENT,
		authenticate,
		authorize(PERMISSIONS.STORAGE_PURGE),
		captureAudit({
			action: AUDIT_ACTIONS.STORAGE_PERMANENTLY_DELETED,
			resource: 'storage',
		}),
		storageDeletePermanentController,
	);

	router.delete(
		STORAGE_PATH_DELETE,
		authenticate,
		authorize(PERMISSIONS.STORAGE_DELETE, PERMISSIONS.STORAGE_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.STORAGE_SOFT_DELETED,
			resource: 'storage',
		}),
		storageDeleteController,
	);
}
