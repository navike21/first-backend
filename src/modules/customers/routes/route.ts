import { Router } from 'express';
import { authenticate } from '@Modules/auth/middlewares/authenticate';
import { authorize } from '@Modules/auth/middlewares/authorize';
import { PERMISSIONS } from '@Constants/permissions';
import { captureAudit } from '@Modules/audit-log/middlewares/captureAudit';
import { AUDIT_ACTIONS } from '@Modules/audit-log/constants/auditActions';
import {
	CUSTOMER_PATH_CREATE,
	CUSTOMER_PATH_LIST,
	CUSTOMER_PATH_GET_BY_ID,
	CUSTOMER_PATH_UPDATE,
	CUSTOMER_PATH_DELETE,
	CUSTOMER_PATH_DELETE_PERMANENT,
	CUSTOMER_PATH_RESTORE,
	CUSTOMER_PATH_TRASH,
	CUSTOMER_PATH_BULK_DELETE,
	CUSTOMER_PATH_BULK_RESTORE,
	CUSTOMER_PATH_BULK_PURGE,
} from '../constants/paths';
import { customerCreateController } from '../controllers/customer.create';
import { customerListController } from '../controllers/customer.list';
import { customerGetByIdController } from '../controllers/customer.getById';
import { customerUpdateController } from '../controllers/customer.update';
import { customerDeleteController } from '../controllers/customer.delete';
import { customerDeletePermanentController } from '../controllers/customer.deletePermanent';
import { customerRestoreController } from '../controllers/customer.restore';
import { customerTrashController } from '../controllers/customer.trash';
import { deleteCustomersBulkController } from '../controllers/customer.deleteBulk';
import { restoreCustomersBulkController } from '../controllers/customer.restoreBulk';
import { purgeCustomersBulkController } from '../controllers/customer.purgeBulk';

export function customersApi(router: Router) {
	router.post(
		CUSTOMER_PATH_CREATE,
		authenticate,
		authorize(PERMISSIONS.CUSTOMERS_CREATE, PERMISSIONS.CUSTOMERS_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.CUSTOMERS_CREATED,
			resource: 'customers',
		}),
		customerCreateController,
	);

	router.get(
		CUSTOMER_PATH_TRASH,
		authenticate,
		authorize(PERMISSIONS.CUSTOMERS_READ, PERMISSIONS.CUSTOMERS_MANAGE),
		customerTrashController,
	);
	router.get(
		CUSTOMER_PATH_LIST,
		authenticate,
		authorize(PERMISSIONS.CUSTOMERS_READ, PERMISSIONS.CUSTOMERS_MANAGE),
		customerListController,
	);

	// Bulk operations (before :id routes to avoid conflicts)
	router.delete(
		CUSTOMER_PATH_BULK_DELETE,
		authenticate,
		authorize(PERMISSIONS.CUSTOMERS_DELETE, PERMISSIONS.CUSTOMERS_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.CUSTOMERS_BULK_SOFT_DELETED,
			resource: 'customers',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		deleteCustomersBulkController,
	);
	router.patch(
		CUSTOMER_PATH_BULK_RESTORE,
		authenticate,
		authorize(PERMISSIONS.CUSTOMERS_UPDATE, PERMISSIONS.CUSTOMERS_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.CUSTOMERS_BULK_RESTORED,
			resource: 'customers',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		restoreCustomersBulkController,
	);
	router.delete(
		CUSTOMER_PATH_BULK_PURGE,
		authenticate,
		authorize(PERMISSIONS.CUSTOMERS_PURGE),
		captureAudit({
			action: AUDIT_ACTIONS.CUSTOMERS_BULK_PERMANENTLY_DELETED,
			resource: 'customers',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		purgeCustomersBulkController,
	);

	router.get(
		CUSTOMER_PATH_GET_BY_ID,
		authenticate,
		authorize(PERMISSIONS.CUSTOMERS_READ, PERMISSIONS.CUSTOMERS_MANAGE),
		customerGetByIdController,
	);

	router.patch(
		CUSTOMER_PATH_RESTORE,
		authenticate,
		authorize(PERMISSIONS.CUSTOMERS_UPDATE, PERMISSIONS.CUSTOMERS_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.CUSTOMERS_RESTORED,
			resource: 'customers',
		}),
		customerRestoreController,
	);
	router.patch(
		CUSTOMER_PATH_UPDATE,
		authenticate,
		authorize(PERMISSIONS.CUSTOMERS_UPDATE, PERMISSIONS.CUSTOMERS_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.CUSTOMERS_UPDATED,
			resource: 'customers',
		}),
		customerUpdateController,
	);

	router.delete(
		CUSTOMER_PATH_DELETE_PERMANENT,
		authenticate,
		authorize(PERMISSIONS.CUSTOMERS_PURGE),
		captureAudit({
			action: AUDIT_ACTIONS.CUSTOMERS_PERMANENTLY_DELETED,
			resource: 'customers',
		}),
		customerDeletePermanentController,
	);
	router.delete(
		CUSTOMER_PATH_DELETE,
		authenticate,
		authorize(PERMISSIONS.CUSTOMERS_DELETE, PERMISSIONS.CUSTOMERS_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.CUSTOMERS_SOFT_DELETED,
			resource: 'customers',
		}),
		customerDeleteController,
	);
}
