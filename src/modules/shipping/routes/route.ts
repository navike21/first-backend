import { Router } from 'express';
import { authenticate } from '@Modules/auth/middlewares/authenticate';
import { authorize } from '@Modules/auth/middlewares/authorize';
import { PERMISSIONS } from '@Constants/permissions';
import { captureAudit } from '@Modules/audit-log/middlewares/captureAudit';
import { AUDIT_ACTIONS } from '@Modules/audit-log/constants/auditActions';
import {
	SHIPPING_RULE_PATH_CREATE,
	SHIPPING_RULE_PATH_LIST,
	SHIPPING_RULE_PATH_GET_BY_ID,
	SHIPPING_RULE_PATH_UPDATE,
	SHIPPING_RULE_PATH_DELETE,
	SHIPPING_RULE_PATH_DELETE_PERMANENT,
	SHIPPING_RULE_PATH_RESTORE,
	SHIPPING_RULE_PATH_TRASH,
	SHIPPING_RULE_PATH_BULK_DELETE,
	SHIPPING_RULE_PATH_BULK_RESTORE,
	SHIPPING_RULE_PATH_BULK_PURGE,
} from '../constants/paths';
import { shippingRuleCreateController } from '../controllers/shippingRule.create';
import { shippingRuleListController } from '../controllers/shippingRule.list';
import { shippingRuleGetByIdController } from '../controllers/shippingRule.getById';
import { shippingRuleUpdateController } from '../controllers/shippingRule.update';
import { shippingRuleDeleteController } from '../controllers/shippingRule.delete';
import { shippingRuleDeletePermanentController } from '../controllers/shippingRule.deletePermanent';
import { shippingRuleRestoreController } from '../controllers/shippingRule.restore';
import { shippingRuleTrashController } from '../controllers/shippingRule.trash';
import { deleteShippingRulesBulkController } from '../controllers/shippingRule.deleteBulk';
import { restoreShippingRulesBulkController } from '../controllers/shippingRule.restoreBulk';
import { purgeShippingRulesBulkController } from '../controllers/shippingRule.purgeBulk';

export function shippingApi(router: Router) {
	router.post(
		SHIPPING_RULE_PATH_CREATE,
		authenticate,
		authorize(PERMISSIONS.SHIPPING_CREATE, PERMISSIONS.SHIPPING_MANAGE),
		captureAudit({ action: AUDIT_ACTIONS.SHIPPING_CREATED, resource: 'shipping' }),
		shippingRuleCreateController,
	);

	router.get(
		SHIPPING_RULE_PATH_TRASH,
		authenticate,
		authorize(PERMISSIONS.SHIPPING_READ, PERMISSIONS.SHIPPING_MANAGE),
		shippingRuleTrashController,
	);
	router.get(
		SHIPPING_RULE_PATH_LIST,
		authenticate,
		authorize(PERMISSIONS.SHIPPING_READ, PERMISSIONS.SHIPPING_MANAGE),
		shippingRuleListController,
	);

	// Bulk operations (before :id routes to avoid conflicts)
	router.delete(
		SHIPPING_RULE_PATH_BULK_DELETE,
		authenticate,
		authorize(PERMISSIONS.SHIPPING_DELETE, PERMISSIONS.SHIPPING_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.SHIPPING_BULK_SOFT_DELETED,
			resource: 'shipping',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		deleteShippingRulesBulkController,
	);
	router.patch(
		SHIPPING_RULE_PATH_BULK_RESTORE,
		authenticate,
		authorize(PERMISSIONS.SHIPPING_UPDATE, PERMISSIONS.SHIPPING_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.SHIPPING_BULK_RESTORED,
			resource: 'shipping',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		restoreShippingRulesBulkController,
	);
	router.delete(
		SHIPPING_RULE_PATH_BULK_PURGE,
		authenticate,
		authorize(PERMISSIONS.SHIPPING_PURGE),
		captureAudit({
			action: AUDIT_ACTIONS.SHIPPING_BULK_PERMANENTLY_DELETED,
			resource: 'shipping',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		purgeShippingRulesBulkController,
	);

	router.get(
		SHIPPING_RULE_PATH_GET_BY_ID,
		authenticate,
		authorize(PERMISSIONS.SHIPPING_READ, PERMISSIONS.SHIPPING_MANAGE),
		shippingRuleGetByIdController,
	);

	router.patch(
		SHIPPING_RULE_PATH_RESTORE,
		authenticate,
		authorize(PERMISSIONS.SHIPPING_UPDATE, PERMISSIONS.SHIPPING_MANAGE),
		captureAudit({ action: AUDIT_ACTIONS.SHIPPING_RESTORED, resource: 'shipping' }),
		shippingRuleRestoreController,
	);
	router.patch(
		SHIPPING_RULE_PATH_UPDATE,
		authenticate,
		authorize(PERMISSIONS.SHIPPING_UPDATE, PERMISSIONS.SHIPPING_MANAGE),
		captureAudit({ action: AUDIT_ACTIONS.SHIPPING_UPDATED, resource: 'shipping' }),
		shippingRuleUpdateController,
	);

	router.delete(
		SHIPPING_RULE_PATH_DELETE_PERMANENT,
		authenticate,
		authorize(PERMISSIONS.SHIPPING_PURGE),
		captureAudit({
			action: AUDIT_ACTIONS.SHIPPING_PERMANENTLY_DELETED,
			resource: 'shipping',
		}),
		shippingRuleDeletePermanentController,
	);
	router.delete(
		SHIPPING_RULE_PATH_DELETE,
		authenticate,
		authorize(PERMISSIONS.SHIPPING_DELETE, PERMISSIONS.SHIPPING_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.SHIPPING_SOFT_DELETED,
			resource: 'shipping',
		}),
		shippingRuleDeleteController,
	);
}
