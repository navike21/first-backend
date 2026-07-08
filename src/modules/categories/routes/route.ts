import { Router } from 'express';
import { authenticate } from '@Modules/auth/middlewares/authenticate';
import { authorize } from '@Modules/auth/middlewares/authorize';
import { PERMISSIONS } from '@Constants/permissions';
import { captureAudit } from '@Modules/audit-log/middlewares/captureAudit';
import { AUDIT_ACTIONS } from '@Modules/audit-log/constants/auditActions';
import {
	CATEGORY_PATH_LIST_PUBLIC,
	CATEGORY_PATH_LIST_ADMIN,
	CATEGORY_PATH_GET_BY_ID,
	CATEGORY_PATH_CREATE,
	CATEGORY_PATH_UPDATE,
	CATEGORY_PATH_DELETE,
	CATEGORY_PATH_PURGE,
	CATEGORY_PATH_TRASH,
	CATEGORY_PATH_RESTORE,
	CATEGORY_PATH_BULK_DELETE,
	CATEGORY_PATH_BULK_RESTORE,
	CATEGORY_PATH_BULK_PURGE,
} from '../constants/paths';
import {
	categoryListPublicController,
	categoryListAdminController,
} from '../controllers/category.list';
import { categoryGetByIdController } from '../controllers/category.getById';
import { categoryCreateController } from '../controllers/category.create';
import { categoryUpdateController } from '../controllers/category.update';
import { categoryDeleteController } from '../controllers/category.delete';
import { categoryPurgeController } from '../controllers/category.purge';
import { categoryRestoreController } from '../controllers/category.restore';
import { categoryTrashController } from '../controllers/category.trash';
import { deleteCategoriesBulkController } from '../controllers/category.deleteBulk';
import { restoreCategoriesBulkController } from '../controllers/category.restoreBulk';
import { purgeCategoriesBulkController } from '../controllers/category.purgeBulk';

export function categoriesApi(router: Router) {
	router.get(CATEGORY_PATH_LIST_PUBLIC, categoryListPublicController);

	router.get(
		CATEGORY_PATH_TRASH,
		authenticate,
		authorize(PERMISSIONS.CATEGORIES_READ, PERMISSIONS.CATEGORIES_MANAGE),
		categoryTrashController,
	);
	router.get(
		CATEGORY_PATH_LIST_ADMIN,
		authenticate,
		authorize(PERMISSIONS.CATEGORIES_READ, PERMISSIONS.CATEGORIES_MANAGE),
		categoryListAdminController,
	);
	// Bulk operations (before :id routes to avoid conflicts)
	router.delete(
		CATEGORY_PATH_BULK_DELETE,
		authenticate,
		authorize(PERMISSIONS.CATEGORIES_DELETE, PERMISSIONS.CATEGORIES_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.CATEGORIES_BULK_SOFT_DELETED,
			resource: 'categories',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		deleteCategoriesBulkController,
	);
	router.patch(
		CATEGORY_PATH_BULK_RESTORE,
		authenticate,
		authorize(PERMISSIONS.CATEGORIES_UPDATE, PERMISSIONS.CATEGORIES_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.CATEGORIES_BULK_RESTORED,
			resource: 'categories',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		restoreCategoriesBulkController,
	);
	router.delete(
		CATEGORY_PATH_BULK_PURGE,
		authenticate,
		authorize(PERMISSIONS.CATEGORIES_PURGE),
		captureAudit({
			action: AUDIT_ACTIONS.CATEGORIES_BULK_PERMANENTLY_DELETED,
			resource: 'categories',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		purgeCategoriesBulkController,
	);

	router.get(
		CATEGORY_PATH_GET_BY_ID,
		authenticate,
		authorize(PERMISSIONS.CATEGORIES_READ, PERMISSIONS.CATEGORIES_MANAGE),
		categoryGetByIdController,
	);

	router.post(
		CATEGORY_PATH_CREATE,
		authenticate,
		authorize(PERMISSIONS.CATEGORIES_CREATE, PERMISSIONS.CATEGORIES_MANAGE),
		captureAudit({ action: AUDIT_ACTIONS.CATEGORIES_CREATED, resource: 'categories' }),
		categoryCreateController,
	);

	router.patch(
		CATEGORY_PATH_RESTORE,
		authenticate,
		authorize(PERMISSIONS.CATEGORIES_UPDATE, PERMISSIONS.CATEGORIES_MANAGE),
		captureAudit({ action: AUDIT_ACTIONS.CATEGORIES_RESTORED, resource: 'categories' }),
		categoryRestoreController,
	);

	router.patch(
		CATEGORY_PATH_UPDATE,
		authenticate,
		authorize(PERMISSIONS.CATEGORIES_UPDATE, PERMISSIONS.CATEGORIES_MANAGE),
		captureAudit({ action: AUDIT_ACTIONS.CATEGORIES_UPDATED, resource: 'categories' }),
		categoryUpdateController,
	);

	router.delete(
		CATEGORY_PATH_PURGE,
		authenticate,
		authorize(PERMISSIONS.CATEGORIES_PURGE),
		captureAudit({ action: AUDIT_ACTIONS.CATEGORIES_PERMANENTLY_DELETED, resource: 'categories' }),
		categoryPurgeController,
	);
	router.delete(
		CATEGORY_PATH_DELETE,
		authenticate,
		authorize(PERMISSIONS.CATEGORIES_DELETE, PERMISSIONS.CATEGORIES_MANAGE),
		captureAudit({ action: AUDIT_ACTIONS.CATEGORIES_SOFT_DELETED, resource: 'categories' }),
		categoryDeleteController,
	);
}
