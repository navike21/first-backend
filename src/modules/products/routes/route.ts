import { Router } from 'express';
import { authenticate } from '@Modules/auth/middlewares/authenticate';
import { authorize } from '@Modules/auth/middlewares/authorize';
import { PERMISSIONS } from '@Constants/permissions';
import { captureAudit } from '@Modules/audit-log/middlewares/captureAudit';
import { AUDIT_ACTIONS } from '@Modules/audit-log/constants/auditActions';
import { acceptImageFields } from '@Modules/storage';
import {
	PRODUCT_PATH_LIST_PUBLIC,
	PRODUCT_PATH_LIST_ADMIN,
	PRODUCT_PATH_GET_BY_ID,
	PRODUCT_PATH_GET_BY_SLUG,
	PRODUCT_PATH_CREATE,
	PRODUCT_PATH_UPDATE,
	PRODUCT_PATH_DELETE,
	PRODUCT_PATH_DELETE_PERMANENT,
	PRODUCT_PATH_RESTORE,
	PRODUCT_PATH_TRASH,
	PRODUCT_PATH_BULK_DELETE,
	PRODUCT_PATH_BULK_RESTORE,
	PRODUCT_PATH_BULK_PURGE,
	PRODUCT_GALLERY_MAX_ITEMS,
} from '../constants/paths';
import { productListPublicController } from '../controllers/product.listPublic';
import { productGetBySlugController } from '../controllers/product.getBySlug';
import { productGetByIdController } from '../controllers/product.getById';
import { productListAdminController } from '../controllers/product.listAdmin';
import { productCreateController } from '../controllers/product.create';
import { productUpdateController } from '../controllers/product.update';
import { productDeleteController } from '../controllers/product.delete';
import { productDeletePermanentController } from '../controllers/product.deletePermanent';
import { productRestoreController } from '../controllers/product.restore';
import { productTrashController } from '../controllers/product.trash';
import { deleteProductsBulkController } from '../controllers/product.deleteBulk';
import { restoreProductsBulkController } from '../controllers/product.restoreBulk';
import { purgeProductsBulkController } from '../controllers/product.purgeBulk';

const acceptProductGallery = () =>
	acceptImageFields([{ name: 'gallery', maxCount: PRODUCT_GALLERY_MAX_ITEMS }]);

export function productsApi(router: Router) {
	router.get(PRODUCT_PATH_LIST_PUBLIC, productListPublicController);

	router.get(
		PRODUCT_PATH_TRASH,
		authenticate,
		authorize(PERMISSIONS.PRODUCTS_READ, PERMISSIONS.PRODUCTS_MANAGE),
		productTrashController,
	);
	router.get(
		PRODUCT_PATH_LIST_ADMIN,
		authenticate,
		authorize(PERMISSIONS.PRODUCTS_READ, PERMISSIONS.PRODUCTS_MANAGE),
		productListAdminController,
	);
	router.get(
		PRODUCT_PATH_GET_BY_ID,
		authenticate,
		authorize(PERMISSIONS.PRODUCTS_READ, PERMISSIONS.PRODUCTS_MANAGE),
		productGetByIdController,
	);
	router.get(PRODUCT_PATH_GET_BY_SLUG, productGetBySlugController);

	// Bulk operations (before :id-shaped routes to avoid conflicts)
	router.delete(
		PRODUCT_PATH_BULK_DELETE,
		authenticate,
		authorize(PERMISSIONS.PRODUCTS_DELETE, PERMISSIONS.PRODUCTS_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.PRODUCTS_BULK_SOFT_DELETED,
			resource: 'products',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		deleteProductsBulkController,
	);
	router.patch(
		PRODUCT_PATH_BULK_RESTORE,
		authenticate,
		authorize(PERMISSIONS.PRODUCTS_UPDATE, PERMISSIONS.PRODUCTS_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.PRODUCTS_BULK_RESTORED,
			resource: 'products',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		restoreProductsBulkController,
	);
	router.delete(
		PRODUCT_PATH_BULK_PURGE,
		authenticate,
		authorize(PERMISSIONS.PRODUCTS_PURGE),
		captureAudit({
			action: AUDIT_ACTIONS.PRODUCTS_BULK_PERMANENTLY_DELETED,
			resource: 'products',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		purgeProductsBulkController,
	);

	router.post(
		PRODUCT_PATH_CREATE,
		authenticate,
		authorize(PERMISSIONS.PRODUCTS_CREATE, PERMISSIONS.PRODUCTS_MANAGE),
		...acceptProductGallery(),
		captureAudit({
			action: AUDIT_ACTIONS.PRODUCTS_CREATED,
			resource: 'products',
		}),
		productCreateController,
	);

	router.patch(
		PRODUCT_PATH_RESTORE,
		authenticate,
		authorize(PERMISSIONS.PRODUCTS_UPDATE, PERMISSIONS.PRODUCTS_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.PRODUCTS_RESTORED,
			resource: 'products',
		}),
		productRestoreController,
	);

	router.patch(
		PRODUCT_PATH_UPDATE,
		authenticate,
		authorize(PERMISSIONS.PRODUCTS_UPDATE, PERMISSIONS.PRODUCTS_MANAGE),
		...acceptProductGallery(),
		captureAudit({
			action: AUDIT_ACTIONS.PRODUCTS_UPDATED,
			resource: 'products',
		}),
		productUpdateController,
	);

	router.delete(
		PRODUCT_PATH_DELETE_PERMANENT,
		authenticate,
		authorize(PERMISSIONS.PRODUCTS_PURGE),
		captureAudit({
			action: AUDIT_ACTIONS.PRODUCTS_PERMANENTLY_DELETED,
			resource: 'products',
		}),
		productDeletePermanentController,
	);
	router.delete(
		PRODUCT_PATH_DELETE,
		authenticate,
		authorize(PERMISSIONS.PRODUCTS_DELETE, PERMISSIONS.PRODUCTS_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.PRODUCTS_SOFT_DELETED,
			resource: 'products',
		}),
		productDeleteController,
	);
}
