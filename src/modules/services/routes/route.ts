import { Router } from 'express';
import { authenticate } from '@Modules/auth/middlewares/authenticate';
import { authorize } from '@Modules/auth/middlewares/authorize';
import { PERMISSIONS } from '@Constants/permissions';
import { captureAudit } from '@Modules/audit-log/middlewares/captureAudit';
import { AUDIT_ACTIONS } from '@Modules/audit-log/constants/auditActions';
import {
	SERVICE_PATH_LIST_PUBLIC,
	SERVICE_PATH_LIST_ADMIN,
	SERVICE_PATH_GET_BY_SLUG,
	SERVICE_PATH_CREATE,
	SERVICE_PATH_UPDATE,
	SERVICE_PATH_DELETE,
} from '../constants/paths';
import { serviceListPublicController } from '../controllers/service.listPublic';
import { serviceListAdminController } from '../controllers/service.listAdmin';
import { serviceGetBySlugController } from '../controllers/service.getBySlug';
import { serviceCreateController } from '../controllers/service.create';
import { serviceUpdateController } from '../controllers/service.update';
import { serviceDeleteController } from '../controllers/service.delete';

export function servicesApi(router: Router) {
	router.get(SERVICE_PATH_LIST_PUBLIC, serviceListPublicController);

	router.get(
		SERVICE_PATH_LIST_ADMIN,
		authenticate,
		authorize(PERMISSIONS.SERVICES_READ, PERMISSIONS.SERVICES_MANAGE),
		serviceListAdminController,
	);

	router.get(SERVICE_PATH_GET_BY_SLUG, serviceGetBySlugController);

	router.post(
		SERVICE_PATH_CREATE,
		authenticate,
		authorize(PERMISSIONS.SERVICES_CREATE, PERMISSIONS.SERVICES_MANAGE),
		captureAudit({ action: AUDIT_ACTIONS.SERVICES_CREATED, resource: 'services' }),
		serviceCreateController,
	);

	router.patch(
		SERVICE_PATH_UPDATE,
		authenticate,
		authorize(PERMISSIONS.SERVICES_UPDATE, PERMISSIONS.SERVICES_MANAGE),
		captureAudit({ action: AUDIT_ACTIONS.SERVICES_UPDATED, resource: 'services' }),
		serviceUpdateController,
	);

	router.delete(
		SERVICE_PATH_DELETE,
		authenticate,
		authorize(PERMISSIONS.SERVICES_DELETE, PERMISSIONS.SERVICES_MANAGE),
		captureAudit({ action: AUDIT_ACTIONS.SERVICES_SOFT_DELETED, resource: 'services' }),
		serviceDeleteController,
	);
}
