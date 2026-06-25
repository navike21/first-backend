import { Router } from 'express';
import { authenticate } from '@Modules/auth/middlewares/authenticate';
import { authorize } from '@Modules/auth/middlewares/authorize';
import { PERMISSIONS } from '@Constants/permissions';
import { captureAudit } from '@Modules/audit-log/middlewares/captureAudit';
import { AUDIT_ACTIONS } from '@Modules/audit-log/constants/auditActions';
import { acceptImage } from '@Modules/storage';
import {
	SERVICE_PATH_LIST_PUBLIC,
	SERVICE_PATH_LIST_ADMIN,
	SERVICE_PATH_GET_BY_SLUG,
	SERVICE_PATH_CREATE,
	SERVICE_PATH_UPDATE,
	SERVICE_PATH_DELETE,
	SERVICE_PATH_DELETE_PERMANENT,
	SERVICE_PATH_RESTORE,
	SERVICE_PATH_TRASH,
	SERVICE_PATH_BULK_DELETE,
	SERVICE_PATH_BULK_RESTORE,
	SERVICE_PATH_BULK_PURGE,
} from '../constants/paths';
import { serviceListPublicController } from '../controllers/service.listPublic';
import { serviceListAdminController } from '../controllers/service.listAdmin';
import { serviceGetBySlugController } from '../controllers/service.getBySlug';
import { serviceCreateController } from '../controllers/service.create';
import { serviceUpdateController } from '../controllers/service.update';
import { serviceDeleteController } from '../controllers/service.delete';
import { serviceDeletePermanentController } from '../controllers/service.deletePermanent';
import { serviceRestoreController } from '../controllers/service.restore';
import { serviceTrashController } from '../controllers/service.trash';
import { deleteServicesBulkController } from '../controllers/service.deleteBulk';
import { restoreServicesBulkController } from '../controllers/service.restoreBulk';
import { purgeServicesBulkController } from '../controllers/service.purgeBulk';

export function servicesApi(router: Router) {
	router.get(SERVICE_PATH_LIST_PUBLIC, serviceListPublicController);

	router.get(
		SERVICE_PATH_TRASH,
		authenticate,
		authorize(PERMISSIONS.SERVICES_READ, PERMISSIONS.SERVICES_MANAGE),
		serviceTrashController,
	);
	router.get(
		SERVICE_PATH_LIST_ADMIN,
		authenticate,
		authorize(PERMISSIONS.SERVICES_READ, PERMISSIONS.SERVICES_MANAGE),
		serviceListAdminController,
	);
	router.get(SERVICE_PATH_GET_BY_SLUG, serviceGetBySlugController);

	// Bulk operations (before :id routes to avoid conflicts)
	router.delete(
		SERVICE_PATH_BULK_DELETE,
		authenticate,
		authorize(PERMISSIONS.SERVICES_DELETE, PERMISSIONS.SERVICES_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.SERVICES_BULK_SOFT_DELETED,
			resource: 'services',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		deleteServicesBulkController,
	);
	router.patch(
		SERVICE_PATH_BULK_RESTORE,
		authenticate,
		authorize(PERMISSIONS.SERVICES_UPDATE, PERMISSIONS.SERVICES_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.SERVICES_BULK_RESTORED,
			resource: 'services',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		restoreServicesBulkController,
	);
	router.delete(
		SERVICE_PATH_BULK_PURGE,
		authenticate,
		authorize(PERMISSIONS.SERVICES_PURGE),
		captureAudit({
			action: AUDIT_ACTIONS.SERVICES_BULK_PERMANENTLY_DELETED,
			resource: 'services',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		purgeServicesBulkController,
	);

	router.post(
		SERVICE_PATH_CREATE,
		authenticate,
		authorize(PERMISSIONS.SERVICES_CREATE, PERMISSIONS.SERVICES_MANAGE),
		...acceptImage('cover'),
		captureAudit({ action: AUDIT_ACTIONS.SERVICES_CREATED, resource: 'services' }),
		serviceCreateController,
	);

	router.patch(
		SERVICE_PATH_RESTORE,
		authenticate,
		authorize(PERMISSIONS.SERVICES_UPDATE, PERMISSIONS.SERVICES_MANAGE),
		captureAudit({ action: AUDIT_ACTIONS.SERVICES_RESTORED, resource: 'services' }),
		serviceRestoreController,
	);

	router.patch(
		SERVICE_PATH_UPDATE,
		authenticate,
		authorize(PERMISSIONS.SERVICES_UPDATE, PERMISSIONS.SERVICES_MANAGE),
		...acceptImage('cover'),
		captureAudit({ action: AUDIT_ACTIONS.SERVICES_UPDATED, resource: 'services' }),
		serviceUpdateController,
	);

	router.delete(
		SERVICE_PATH_DELETE_PERMANENT,
		authenticate,
		authorize(PERMISSIONS.SERVICES_PURGE),
		captureAudit({ action: AUDIT_ACTIONS.SERVICES_PERMANENTLY_DELETED, resource: 'services' }),
		serviceDeletePermanentController,
	);
	router.delete(
		SERVICE_PATH_DELETE,
		authenticate,
		authorize(PERMISSIONS.SERVICES_DELETE, PERMISSIONS.SERVICES_MANAGE),
		captureAudit({ action: AUDIT_ACTIONS.SERVICES_SOFT_DELETED, resource: 'services' }),
		serviceDeleteController,
	);
}
