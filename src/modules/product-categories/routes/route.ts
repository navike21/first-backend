import { Router } from 'express';
import { authenticate } from '@Modules/auth/middlewares/authenticate';
import { authorize } from '@Modules/auth/middlewares/authorize';
import { PERMISSIONS } from '@Constants/permissions';
import { captureAudit } from '@Modules/audit-log/middlewares/captureAudit';
import { AUDIT_ACTIONS } from '@Modules/audit-log/constants/auditActions';
import {
	PRODUCT_CATEGORY_PATH_LIST_PUBLIC,
	PRODUCT_CATEGORY_PATH_LIST_ADMIN,
	PRODUCT_CATEGORY_PATH_GET_BY_ID,
	PRODUCT_CATEGORY_PATH_CREATE,
	PRODUCT_CATEGORY_PATH_UPDATE,
	PRODUCT_CATEGORY_PATH_DELETE,
	PRODUCT_CATEGORY_PATH_PURGE,
	PRODUCT_CATEGORY_PATH_TRASH,
	PRODUCT_CATEGORY_PATH_RESTORE,
	PRODUCT_CATEGORY_PATH_BULK_DELETE,
	PRODUCT_CATEGORY_PATH_BULK_RESTORE,
	PRODUCT_CATEGORY_PATH_BULK_PURGE,
} from '../constants/paths';
import {
	productCategoryListPublicController,
	productCategoryListAdminController,
} from '../controllers/productCategory.list';
import { productCategoryGetByIdController } from '../controllers/productCategory.getById';
import { productCategoryCreateController } from '../controllers/productCategory.create';
import { productCategoryUpdateController } from '../controllers/productCategory.update';
import { productCategoryDeleteController } from '../controllers/productCategory.delete';
import { productCategoryPurgeController } from '../controllers/productCategory.purge';
import { productCategoryRestoreController } from '../controllers/productCategory.restore';
import { productCategoryTrashController } from '../controllers/productCategory.trash';
import { deleteProductCategoriesBulkController } from '../controllers/productCategory.deleteBulk';
import { restoreProductCategoriesBulkController } from '../controllers/productCategory.restoreBulk';
import { purgeProductCategoriesBulkController } from '../controllers/productCategory.purgeBulk';

export function productCategoriesApi(router: Router) {
	router.get(
		PRODUCT_CATEGORY_PATH_LIST_PUBLIC,
		productCategoryListPublicController,
	);

	router.get(
		PRODUCT_CATEGORY_PATH_TRASH,
		authenticate,
		authorize(
			PERMISSIONS.PRODUCT_CATEGORIES_READ,
			PERMISSIONS.PRODUCT_CATEGORIES_MANAGE,
		),
		productCategoryTrashController,
	);
	router.get(
		PRODUCT_CATEGORY_PATH_LIST_ADMIN,
		authenticate,
		authorize(
			PERMISSIONS.PRODUCT_CATEGORIES_READ,
			PERMISSIONS.PRODUCT_CATEGORIES_MANAGE,
		),
		productCategoryListAdminController,
	);
	// Bulk operations (before :id routes to avoid conflicts)
	router.delete(
		PRODUCT_CATEGORY_PATH_BULK_DELETE,
		authenticate,
		authorize(
			PERMISSIONS.PRODUCT_CATEGORIES_DELETE,
			PERMISSIONS.PRODUCT_CATEGORIES_MANAGE,
		),
		captureAudit({
			action: AUDIT_ACTIONS.PRODUCT_CATEGORIES_BULK_SOFT_DELETED,
			resource: 'product-categories',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		deleteProductCategoriesBulkController,
	);
	router.patch(
		PRODUCT_CATEGORY_PATH_BULK_RESTORE,
		authenticate,
		authorize(
			PERMISSIONS.PRODUCT_CATEGORIES_UPDATE,
			PERMISSIONS.PRODUCT_CATEGORIES_MANAGE,
		),
		captureAudit({
			action: AUDIT_ACTIONS.PRODUCT_CATEGORIES_BULK_RESTORED,
			resource: 'product-categories',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		restoreProductCategoriesBulkController,
	);
	router.delete(
		PRODUCT_CATEGORY_PATH_BULK_PURGE,
		authenticate,
		authorize(PERMISSIONS.PRODUCT_CATEGORIES_PURGE),
		captureAudit({
			action: AUDIT_ACTIONS.PRODUCT_CATEGORIES_BULK_PERMANENTLY_DELETED,
			resource: 'product-categories',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		purgeProductCategoriesBulkController,
	);

	router.get(
		PRODUCT_CATEGORY_PATH_GET_BY_ID,
		authenticate,
		authorize(
			PERMISSIONS.PRODUCT_CATEGORIES_READ,
			PERMISSIONS.PRODUCT_CATEGORIES_MANAGE,
		),
		productCategoryGetByIdController,
	);

	router.post(
		PRODUCT_CATEGORY_PATH_CREATE,
		authenticate,
		authorize(
			PERMISSIONS.PRODUCT_CATEGORIES_CREATE,
			PERMISSIONS.PRODUCT_CATEGORIES_MANAGE,
		),
		captureAudit({
			action: AUDIT_ACTIONS.PRODUCT_CATEGORIES_CREATED,
			resource: 'product-categories',
		}),
		productCategoryCreateController,
	);

	router.patch(
		PRODUCT_CATEGORY_PATH_RESTORE,
		authenticate,
		authorize(
			PERMISSIONS.PRODUCT_CATEGORIES_UPDATE,
			PERMISSIONS.PRODUCT_CATEGORIES_MANAGE,
		),
		captureAudit({
			action: AUDIT_ACTIONS.PRODUCT_CATEGORIES_RESTORED,
			resource: 'product-categories',
		}),
		productCategoryRestoreController,
	);

	router.patch(
		PRODUCT_CATEGORY_PATH_UPDATE,
		authenticate,
		authorize(
			PERMISSIONS.PRODUCT_CATEGORIES_UPDATE,
			PERMISSIONS.PRODUCT_CATEGORIES_MANAGE,
		),
		captureAudit({
			action: AUDIT_ACTIONS.PRODUCT_CATEGORIES_UPDATED,
			resource: 'product-categories',
		}),
		productCategoryUpdateController,
	);

	router.delete(
		PRODUCT_CATEGORY_PATH_PURGE,
		authenticate,
		authorize(PERMISSIONS.PRODUCT_CATEGORIES_PURGE),
		captureAudit({
			action: AUDIT_ACTIONS.PRODUCT_CATEGORIES_PERMANENTLY_DELETED,
			resource: 'product-categories',
		}),
		productCategoryPurgeController,
	);
	router.delete(
		PRODUCT_CATEGORY_PATH_DELETE,
		authenticate,
		authorize(
			PERMISSIONS.PRODUCT_CATEGORIES_DELETE,
			PERMISSIONS.PRODUCT_CATEGORIES_MANAGE,
		),
		captureAudit({
			action: AUDIT_ACTIONS.PRODUCT_CATEGORIES_SOFT_DELETED,
			resource: 'product-categories',
		}),
		productCategoryDeleteController,
	);
}
