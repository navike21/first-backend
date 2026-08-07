import { Router } from 'express';
import { authenticate } from '@Modules/auth/middlewares/authenticate';
import { authorize } from '@Modules/auth/middlewares/authorize';
import { PERMISSIONS } from '@Constants/permissions';
import { captureAudit } from '@Modules/audit-log/middlewares/captureAudit';
import { AUDIT_ACTIONS } from '@Modules/audit-log/constants/auditActions';
import {
	PAYMENT_PROVIDER_PATH_LIST,
	PAYMENT_PROVIDER_PATH_UPDATE,
	PAYMENT_METHOD_PATH_CREATE,
	PAYMENT_METHOD_PATH_LIST,
	PAYMENT_METHOD_PATH_GET_BY_ID,
	PAYMENT_METHOD_PATH_UPDATE,
	PAYMENT_METHOD_PATH_DELETE,
	PAYMENT_METHOD_PATH_DELETE_PERMANENT,
	PAYMENT_METHOD_PATH_RESTORE,
	PAYMENT_METHOD_PATH_TRASH,
	PAYMENT_METHOD_PATH_BULK_DELETE,
	PAYMENT_METHOD_PATH_BULK_RESTORE,
	PAYMENT_METHOD_PATH_BULK_PURGE,
} from '../constants/paths';
import { paymentProviderConfigListController } from '../controllers/paymentProviderConfig.list';
import { paymentProviderConfigUpdateController } from '../controllers/paymentProviderConfig.update';
import { paymentMethodCreateController } from '../controllers/paymentMethod.create';
import { paymentMethodListController } from '../controllers/paymentMethod.list';
import { paymentMethodGetByIdController } from '../controllers/paymentMethod.getById';
import { paymentMethodUpdateController } from '../controllers/paymentMethod.update';
import { paymentMethodDeleteController } from '../controllers/paymentMethod.delete';
import { paymentMethodDeletePermanentController } from '../controllers/paymentMethod.deletePermanent';
import { paymentMethodRestoreController } from '../controllers/paymentMethod.restore';
import { paymentMethodTrashController } from '../controllers/paymentMethod.trash';
import { deletePaymentMethodsBulkController } from '../controllers/paymentMethod.deleteBulk';
import { restorePaymentMethodsBulkController } from '../controllers/paymentMethod.restoreBulk';
import { purgePaymentMethodsBulkController } from '../controllers/paymentMethod.purgeBulk';

export function paymentsApi(router: Router) {
	router.get(
		PAYMENT_PROVIDER_PATH_LIST,
		authenticate,
		authorize(PERMISSIONS.PAYMENTS_READ, PERMISSIONS.PAYMENTS_MANAGE),
		paymentProviderConfigListController,
	);
	router.patch(
		PAYMENT_PROVIDER_PATH_UPDATE,
		authenticate,
		authorize(PERMISSIONS.PAYMENTS_UPDATE, PERMISSIONS.PAYMENTS_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.PAYMENT_PROVIDER_CONFIG_UPDATED,
			resource: 'payments',
		}),
		paymentProviderConfigUpdateController,
	);

	router.post(
		PAYMENT_METHOD_PATH_CREATE,
		authenticate,
		authorize(PERMISSIONS.PAYMENTS_CREATE, PERMISSIONS.PAYMENTS_MANAGE),
		captureAudit({ action: AUDIT_ACTIONS.PAYMENT_METHOD_CREATED, resource: 'payments' }),
		paymentMethodCreateController,
	);

	router.get(
		PAYMENT_METHOD_PATH_TRASH,
		authenticate,
		authorize(PERMISSIONS.PAYMENTS_READ, PERMISSIONS.PAYMENTS_MANAGE),
		paymentMethodTrashController,
	);
	router.get(
		PAYMENT_METHOD_PATH_LIST,
		authenticate,
		authorize(PERMISSIONS.PAYMENTS_READ, PERMISSIONS.PAYMENTS_MANAGE),
		paymentMethodListController,
	);

	// Bulk operations (before :id routes to avoid conflicts)
	router.delete(
		PAYMENT_METHOD_PATH_BULK_DELETE,
		authenticate,
		authorize(PERMISSIONS.PAYMENTS_DELETE, PERMISSIONS.PAYMENTS_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.PAYMENT_METHOD_BULK_SOFT_DELETED,
			resource: 'payments',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		deletePaymentMethodsBulkController,
	);
	router.patch(
		PAYMENT_METHOD_PATH_BULK_RESTORE,
		authenticate,
		authorize(PERMISSIONS.PAYMENTS_UPDATE, PERMISSIONS.PAYMENTS_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.PAYMENT_METHOD_BULK_RESTORED,
			resource: 'payments',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		restorePaymentMethodsBulkController,
	);
	router.delete(
		PAYMENT_METHOD_PATH_BULK_PURGE,
		authenticate,
		authorize(PERMISSIONS.PAYMENTS_PURGE),
		captureAudit({
			action: AUDIT_ACTIONS.PAYMENT_METHOD_BULK_PERMANENTLY_DELETED,
			resource: 'payments',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		purgePaymentMethodsBulkController,
	);

	router.get(
		PAYMENT_METHOD_PATH_GET_BY_ID,
		authenticate,
		authorize(PERMISSIONS.PAYMENTS_READ, PERMISSIONS.PAYMENTS_MANAGE),
		paymentMethodGetByIdController,
	);

	router.patch(
		PAYMENT_METHOD_PATH_RESTORE,
		authenticate,
		authorize(PERMISSIONS.PAYMENTS_UPDATE, PERMISSIONS.PAYMENTS_MANAGE),
		captureAudit({ action: AUDIT_ACTIONS.PAYMENT_METHOD_RESTORED, resource: 'payments' }),
		paymentMethodRestoreController,
	);
	router.patch(
		PAYMENT_METHOD_PATH_UPDATE,
		authenticate,
		authorize(PERMISSIONS.PAYMENTS_UPDATE, PERMISSIONS.PAYMENTS_MANAGE),
		captureAudit({ action: AUDIT_ACTIONS.PAYMENT_METHOD_UPDATED, resource: 'payments' }),
		paymentMethodUpdateController,
	);

	router.delete(
		PAYMENT_METHOD_PATH_DELETE_PERMANENT,
		authenticate,
		authorize(PERMISSIONS.PAYMENTS_PURGE),
		captureAudit({
			action: AUDIT_ACTIONS.PAYMENT_METHOD_PERMANENTLY_DELETED,
			resource: 'payments',
		}),
		paymentMethodDeletePermanentController,
	);
	router.delete(
		PAYMENT_METHOD_PATH_DELETE,
		authenticate,
		authorize(PERMISSIONS.PAYMENTS_DELETE, PERMISSIONS.PAYMENTS_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.PAYMENT_METHOD_SOFT_DELETED,
			resource: 'payments',
		}),
		paymentMethodDeleteController,
	);
}
