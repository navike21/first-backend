import { Router } from 'express';
import { authenticate } from '@Modules/auth/middlewares/authenticate';
import { authorize } from '@Modules/auth/middlewares/authorize';
import { PERMISSIONS } from '@Constants/permissions';
import { captureAudit } from '@Modules/audit-log/middlewares/captureAudit';
import { AUDIT_ACTIONS } from '@Modules/audit-log/constants/auditActions';
import { acceptImage } from '@Modules/storage';
import {
	CLIENT_PATH_CREATE,
	CLIENT_PATH_LIST,
	CLIENT_PATH_GET_BY_ID,
	CLIENT_PATH_UPDATE,
	CLIENT_PATH_DELETE,
	CLIENT_PATH_DELETE_PERMANENT,
	CLIENT_PATH_RESTORE,
	CLIENT_PATH_TRASH,
	CLIENT_PATH_BULK_DELETE,
	CLIENT_PATH_BULK_RESTORE,
	CLIENT_PATH_BULK_PURGE,
} from '../constants/paths';
import { clientCreateController } from '../controllers/client.create';
import { clientListController } from '../controllers/client.list';
import { clientGetByIdController } from '../controllers/client.getById';
import { clientUpdateController } from '../controllers/client.update';
import { clientDeleteController } from '../controllers/client.delete';
import { clientDeletePermanentController } from '../controllers/client.deletePermanent';
import { clientRestoreController } from '../controllers/client.restore';
import { clientTrashController } from '../controllers/client.trash';
import { deleteClientsBulkController } from '../controllers/client.deleteBulk';
import { restoreClientsBulkController } from '../controllers/client.restoreBulk';
import { purgeClientsBulkController } from '../controllers/client.purgeBulk';

export function clientsApi(router: Router) {
	router.post(
		CLIENT_PATH_CREATE,
		authenticate,
		authorize(PERMISSIONS.CLIENTS_CREATE, PERMISSIONS.CLIENTS_MANAGE),
		...acceptImage('logo'),
		captureAudit({
			action: AUDIT_ACTIONS.CLIENTS_CREATED,
			resource: 'clients',
		}),
		clientCreateController,
	);

	router.get(
		CLIENT_PATH_TRASH,
		authenticate,
		authorize(PERMISSIONS.CLIENTS_READ, PERMISSIONS.CLIENTS_MANAGE),
		clientTrashController,
	);
	router.get(
		CLIENT_PATH_LIST,
		authenticate,
		authorize(PERMISSIONS.CLIENTS_READ, PERMISSIONS.CLIENTS_MANAGE),
		clientListController,
	);

	// Bulk operations (before :id routes to avoid conflicts)
	router.delete(
		CLIENT_PATH_BULK_DELETE,
		authenticate,
		authorize(PERMISSIONS.CLIENTS_DELETE, PERMISSIONS.CLIENTS_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.CLIENTS_BULK_SOFT_DELETED,
			resource: 'clients',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		deleteClientsBulkController,
	);
	router.patch(
		CLIENT_PATH_BULK_RESTORE,
		authenticate,
		authorize(PERMISSIONS.CLIENTS_UPDATE, PERMISSIONS.CLIENTS_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.CLIENTS_BULK_RESTORED,
			resource: 'clients',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		restoreClientsBulkController,
	);
	router.delete(
		CLIENT_PATH_BULK_PURGE,
		authenticate,
		authorize(PERMISSIONS.CLIENTS_PURGE),
		captureAudit({
			action: AUDIT_ACTIONS.CLIENTS_BULK_PERMANENTLY_DELETED,
			resource: 'clients',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		purgeClientsBulkController,
	);

	router.get(
		CLIENT_PATH_GET_BY_ID,
		authenticate,
		authorize(PERMISSIONS.CLIENTS_READ, PERMISSIONS.CLIENTS_MANAGE),
		clientGetByIdController,
	);

	router.patch(
		CLIENT_PATH_RESTORE,
		authenticate,
		authorize(PERMISSIONS.CLIENTS_UPDATE, PERMISSIONS.CLIENTS_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.CLIENTS_RESTORED,
			resource: 'clients',
		}),
		clientRestoreController,
	);
	router.patch(
		CLIENT_PATH_UPDATE,
		authenticate,
		authorize(PERMISSIONS.CLIENTS_UPDATE, PERMISSIONS.CLIENTS_MANAGE),
		...acceptImage('logo'),
		captureAudit({
			action: AUDIT_ACTIONS.CLIENTS_UPDATED,
			resource: 'clients',
		}),
		clientUpdateController,
	);

	router.delete(
		CLIENT_PATH_DELETE_PERMANENT,
		authenticate,
		authorize(PERMISSIONS.CLIENTS_PURGE),
		captureAudit({
			action: AUDIT_ACTIONS.CLIENTS_PERMANENTLY_DELETED,
			resource: 'clients',
		}),
		clientDeletePermanentController,
	);
	router.delete(
		CLIENT_PATH_DELETE,
		authenticate,
		authorize(PERMISSIONS.CLIENTS_DELETE, PERMISSIONS.CLIENTS_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.CLIENTS_SOFT_DELETED,
			resource: 'clients',
		}),
		clientDeleteController,
	);
}
