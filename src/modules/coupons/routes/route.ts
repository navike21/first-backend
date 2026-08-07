import { Router } from 'express';
import { authenticate } from '@Modules/auth/middlewares/authenticate';
import { authorize } from '@Modules/auth/middlewares/authorize';
import { PERMISSIONS } from '@Constants/permissions';
import { captureAudit } from '@Modules/audit-log/middlewares/captureAudit';
import { AUDIT_ACTIONS } from '@Modules/audit-log/constants/auditActions';
import {
	COUPON_PATH_CREATE,
	COUPON_PATH_LIST,
	COUPON_PATH_GET_BY_ID,
	COUPON_PATH_UPDATE,
	COUPON_PATH_DELETE,
	COUPON_PATH_DELETE_PERMANENT,
	COUPON_PATH_RESTORE,
	COUPON_PATH_TRASH,
	COUPON_PATH_BULK_DELETE,
	COUPON_PATH_BULK_RESTORE,
	COUPON_PATH_BULK_PURGE,
} from '../constants/paths';
import { couponCreateController } from '../controllers/coupon.create';
import { couponListController } from '../controllers/coupon.list';
import { couponGetByIdController } from '../controllers/coupon.getById';
import { couponUpdateController } from '../controllers/coupon.update';
import { couponDeleteController } from '../controllers/coupon.delete';
import { couponDeletePermanentController } from '../controllers/coupon.deletePermanent';
import { couponRestoreController } from '../controllers/coupon.restore';
import { couponTrashController } from '../controllers/coupon.trash';
import { deleteCouponsBulkController } from '../controllers/coupon.deleteBulk';
import { restoreCouponsBulkController } from '../controllers/coupon.restoreBulk';
import { purgeCouponsBulkController } from '../controllers/coupon.purgeBulk';

export function couponsApi(router: Router) {
	router.post(
		COUPON_PATH_CREATE,
		authenticate,
		authorize(PERMISSIONS.COUPONS_CREATE, PERMISSIONS.COUPONS_MANAGE),
		captureAudit({ action: AUDIT_ACTIONS.COUPONS_CREATED, resource: 'coupons' }),
		couponCreateController,
	);

	router.get(
		COUPON_PATH_TRASH,
		authenticate,
		authorize(PERMISSIONS.COUPONS_READ, PERMISSIONS.COUPONS_MANAGE),
		couponTrashController,
	);
	router.get(
		COUPON_PATH_LIST,
		authenticate,
		authorize(PERMISSIONS.COUPONS_READ, PERMISSIONS.COUPONS_MANAGE),
		couponListController,
	);

	// Bulk operations (before :id routes to avoid conflicts)
	router.delete(
		COUPON_PATH_BULK_DELETE,
		authenticate,
		authorize(PERMISSIONS.COUPONS_DELETE, PERMISSIONS.COUPONS_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.COUPONS_BULK_SOFT_DELETED,
			resource: 'coupons',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		deleteCouponsBulkController,
	);
	router.patch(
		COUPON_PATH_BULK_RESTORE,
		authenticate,
		authorize(PERMISSIONS.COUPONS_UPDATE, PERMISSIONS.COUPONS_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.COUPONS_BULK_RESTORED,
			resource: 'coupons',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		restoreCouponsBulkController,
	);
	router.delete(
		COUPON_PATH_BULK_PURGE,
		authenticate,
		authorize(PERMISSIONS.COUPONS_PURGE),
		captureAudit({
			action: AUDIT_ACTIONS.COUPONS_BULK_PERMANENTLY_DELETED,
			resource: 'coupons',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		purgeCouponsBulkController,
	);

	router.get(
		COUPON_PATH_GET_BY_ID,
		authenticate,
		authorize(PERMISSIONS.COUPONS_READ, PERMISSIONS.COUPONS_MANAGE),
		couponGetByIdController,
	);

	router.patch(
		COUPON_PATH_RESTORE,
		authenticate,
		authorize(PERMISSIONS.COUPONS_UPDATE, PERMISSIONS.COUPONS_MANAGE),
		captureAudit({ action: AUDIT_ACTIONS.COUPONS_RESTORED, resource: 'coupons' }),
		couponRestoreController,
	);
	router.patch(
		COUPON_PATH_UPDATE,
		authenticate,
		authorize(PERMISSIONS.COUPONS_UPDATE, PERMISSIONS.COUPONS_MANAGE),
		captureAudit({ action: AUDIT_ACTIONS.COUPONS_UPDATED, resource: 'coupons' }),
		couponUpdateController,
	);

	router.delete(
		COUPON_PATH_DELETE_PERMANENT,
		authenticate,
		authorize(PERMISSIONS.COUPONS_PURGE),
		captureAudit({
			action: AUDIT_ACTIONS.COUPONS_PERMANENTLY_DELETED,
			resource: 'coupons',
		}),
		couponDeletePermanentController,
	);
	router.delete(
		COUPON_PATH_DELETE,
		authenticate,
		authorize(PERMISSIONS.COUPONS_DELETE, PERMISSIONS.COUPONS_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.COUPONS_SOFT_DELETED,
			resource: 'coupons',
		}),
		couponDeleteController,
	);
}
