import { Router } from 'express';
import { authenticate } from '@Modules/auth/middlewares/authenticate';
import { authorize } from '@Modules/auth/middlewares/authorize';
import { PERMISSIONS } from '@Constants/permissions';
import { captureAudit } from '@Modules/audit-log/middlewares/captureAudit';
import { AUDIT_ACTIONS } from '@Modules/audit-log/constants/auditActions';
import {
	TAG_PATH_LIST_PUBLIC,
	TAG_PATH_LIST_ADMIN,
	TAG_PATH_GET_BY_ID,
	TAG_PATH_CREATE,
	TAG_PATH_UPDATE,
	TAG_PATH_DELETE,
	TAG_PATH_PURGE,
	TAG_PATH_TRASH,
	TAG_PATH_RESTORE,
	TAG_PATH_BULK_DELETE,
	TAG_PATH_BULK_RESTORE,
	TAG_PATH_BULK_PURGE,
} from '../constants/paths';
import { tagListPublicController, tagListAdminController } from '../controllers/tag.list';
import { tagGetByIdController } from '../controllers/tag.getById';
import { tagCreateController } from '../controllers/tag.create';
import { tagUpdateController } from '../controllers/tag.update';
import { tagDeleteController } from '../controllers/tag.delete';
import { tagPurgeController } from '../controllers/tag.purge';
import { tagRestoreController } from '../controllers/tag.restore';
import { tagTrashController } from '../controllers/tag.trash';
import { deleteTagsBulkController } from '../controllers/tag.deleteBulk';
import { restoreTagsBulkController } from '../controllers/tag.restoreBulk';
import { purgeTagsBulkController } from '../controllers/tag.purgeBulk';

export function tagsApi(router: Router) {
	router.get(TAG_PATH_LIST_PUBLIC, tagListPublicController);

	router.get(
		TAG_PATH_TRASH,
		authenticate,
		authorize(PERMISSIONS.TAGS_READ, PERMISSIONS.TAGS_MANAGE),
		tagTrashController,
	);
	router.get(
		TAG_PATH_LIST_ADMIN,
		authenticate,
		authorize(PERMISSIONS.TAGS_READ, PERMISSIONS.TAGS_MANAGE),
		tagListAdminController,
	);
	// Bulk operations (before :id routes to avoid conflicts)
	router.delete(
		TAG_PATH_BULK_DELETE,
		authenticate,
		authorize(PERMISSIONS.TAGS_DELETE, PERMISSIONS.TAGS_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.TAGS_BULK_SOFT_DELETED,
			resource: 'tags',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		deleteTagsBulkController,
	);
	router.patch(
		TAG_PATH_BULK_RESTORE,
		authenticate,
		authorize(PERMISSIONS.TAGS_UPDATE, PERMISSIONS.TAGS_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.TAGS_BULK_RESTORED,
			resource: 'tags',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		restoreTagsBulkController,
	);
	router.delete(
		TAG_PATH_BULK_PURGE,
		authenticate,
		authorize(PERMISSIONS.TAGS_PURGE),
		captureAudit({
			action: AUDIT_ACTIONS.TAGS_BULK_PERMANENTLY_DELETED,
			resource: 'tags',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		purgeTagsBulkController,
	);

	router.get(
		TAG_PATH_GET_BY_ID,
		authenticate,
		authorize(PERMISSIONS.TAGS_READ, PERMISSIONS.TAGS_MANAGE),
		tagGetByIdController,
	);

	router.post(
		TAG_PATH_CREATE,
		authenticate,
		authorize(PERMISSIONS.TAGS_CREATE, PERMISSIONS.TAGS_MANAGE),
		captureAudit({ action: AUDIT_ACTIONS.TAGS_CREATED, resource: 'tags' }),
		tagCreateController,
	);

	router.patch(
		TAG_PATH_RESTORE,
		authenticate,
		authorize(PERMISSIONS.TAGS_UPDATE, PERMISSIONS.TAGS_MANAGE),
		captureAudit({ action: AUDIT_ACTIONS.TAGS_RESTORED, resource: 'tags' }),
		tagRestoreController,
	);

	router.patch(
		TAG_PATH_UPDATE,
		authenticate,
		authorize(PERMISSIONS.TAGS_UPDATE, PERMISSIONS.TAGS_MANAGE),
		captureAudit({ action: AUDIT_ACTIONS.TAGS_UPDATED, resource: 'tags' }),
		tagUpdateController,
	);

	router.delete(
		TAG_PATH_PURGE,
		authenticate,
		authorize(PERMISSIONS.TAGS_PURGE),
		captureAudit({ action: AUDIT_ACTIONS.TAGS_PERMANENTLY_DELETED, resource: 'tags' }),
		tagPurgeController,
	);
	router.delete(
		TAG_PATH_DELETE,
		authenticate,
		authorize(PERMISSIONS.TAGS_DELETE, PERMISSIONS.TAGS_MANAGE),
		captureAudit({ action: AUDIT_ACTIONS.TAGS_SOFT_DELETED, resource: 'tags' }),
		tagDeleteController,
	);
}
