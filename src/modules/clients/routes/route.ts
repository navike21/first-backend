import { Router } from 'express';
import { authenticate } from '@Modules/auth/middlewares/authenticate';
import { authorize } from '@Modules/auth/middlewares/authorize';
import { PERMISSIONS } from '@Constants/permissions';
import { captureAudit } from '@Modules/audit-log/middlewares/captureAudit';
import { AUDIT_ACTIONS } from '@Modules/audit-log/constants/auditActions';
import {
	CLIENT_PATH_CREATE,
	CLIENT_PATH_LIST,
	CLIENT_PATH_GET_BY_ID,
	CLIENT_PATH_UPDATE,
	CLIENT_PATH_DELETE,
} from '../constants/paths';
import { clientCreateController } from '../controllers/client.create';
import { clientListController } from '../controllers/client.list';
import { clientGetByIdController } from '../controllers/client.getById';
import { clientUpdateController } from '../controllers/client.update';
import { clientDeleteController } from '../controllers/client.delete';

export function clientsApi(router: Router) {
	router.post(
		CLIENT_PATH_CREATE,
		authenticate,
		authorize(PERMISSIONS.CLIENTS_CREATE, PERMISSIONS.CLIENTS_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.CLIENTS_CREATED,
			resource: 'clients',
		}),
		clientCreateController,
	);

	router.get(
		CLIENT_PATH_LIST,
		authenticate,
		authorize(PERMISSIONS.CLIENTS_READ, PERMISSIONS.CLIENTS_MANAGE),
		clientListController,
	);

	router.get(
		CLIENT_PATH_GET_BY_ID,
		authenticate,
		authorize(PERMISSIONS.CLIENTS_READ, PERMISSIONS.CLIENTS_MANAGE),
		clientGetByIdController,
	);

	router.patch(
		CLIENT_PATH_UPDATE,
		authenticate,
		authorize(PERMISSIONS.CLIENTS_UPDATE, PERMISSIONS.CLIENTS_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.CLIENTS_UPDATED,
			resource: 'clients',
		}),
		clientUpdateController,
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
