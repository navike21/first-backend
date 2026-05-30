import { Router } from 'express';
import { authenticate } from '@Modules/auth/middlewares/authenticate';
import { authorize } from '@Modules/auth/middlewares/authorize';
import { PERMISSIONS } from '@Constants/permissions';
import { captureAudit } from '@Modules/audit-log/middlewares/captureAudit';
import { AUDIT_ACTIONS } from '@Modules/audit-log/constants/auditActions';
import {
	COLLABORATOR_PATH_LIST_PUBLIC,
	COLLABORATOR_PATH_LIST_ADMIN,
	COLLABORATOR_PATH_GET_BY_ID,
	COLLABORATOR_PATH_CREATE,
	COLLABORATOR_PATH_UPDATE,
	COLLABORATOR_PATH_DELETE,
	COLLABORATOR_PATH_PURGE,
	COLLABORATOR_PATH_RESTORE,
	COLLABORATOR_PATH_TRASH,
} from '../constants/paths';
import {
	collaboratorListPublicController,
	collaboratorListAdminController,
} from '../controllers/collaborator.list';
import { collaboratorGetByIdController } from '../controllers/collaborator.getById';
import { collaboratorCreateController } from '../controllers/collaborator.create';
import { collaboratorUpdateController } from '../controllers/collaborator.update';
import { collaboratorDeleteController } from '../controllers/collaborator.delete';
import { collaboratorPurgeController } from '../controllers/collaborator.purge';
import { collaboratorRestoreController } from '../controllers/collaborator.restore';
import { collaboratorTrashController } from '../controllers/collaborator.trash';

export function collaboratorsApi(router: Router) {
	router.get(COLLABORATOR_PATH_LIST_PUBLIC, collaboratorListPublicController);

	router.get(
		COLLABORATOR_PATH_TRASH,
		authenticate,
		authorize(PERMISSIONS.COLLABORATORS_READ, PERMISSIONS.COLLABORATORS_MANAGE),
		collaboratorTrashController,
	);
	router.get(
		COLLABORATOR_PATH_LIST_ADMIN,
		authenticate,
		authorize(PERMISSIONS.COLLABORATORS_READ, PERMISSIONS.COLLABORATORS_MANAGE),
		collaboratorListAdminController,
	);
	router.get(COLLABORATOR_PATH_GET_BY_ID, collaboratorGetByIdController);

	router.post(
		COLLABORATOR_PATH_CREATE,
		authenticate,
		authorize(PERMISSIONS.COLLABORATORS_CREATE, PERMISSIONS.COLLABORATORS_MANAGE),
		captureAudit({ action: AUDIT_ACTIONS.COLLABORATOR_CREATED, resource: 'collaborators' }),
		collaboratorCreateController,
	);

	router.patch(
		COLLABORATOR_PATH_RESTORE,
		authenticate,
		authorize(PERMISSIONS.COLLABORATORS_UPDATE, PERMISSIONS.COLLABORATORS_MANAGE),
		captureAudit({ action: AUDIT_ACTIONS.COLLABORATOR_RESTORED, resource: 'collaborators' }),
		collaboratorRestoreController,
	);
	router.patch(
		COLLABORATOR_PATH_UPDATE,
		authenticate,
		authorize(PERMISSIONS.COLLABORATORS_UPDATE, PERMISSIONS.COLLABORATORS_MANAGE),
		captureAudit({ action: AUDIT_ACTIONS.COLLABORATOR_UPDATED, resource: 'collaborators' }),
		collaboratorUpdateController,
	);

	router.delete(
		COLLABORATOR_PATH_PURGE,
		authenticate,
		authorize(PERMISSIONS.COLLABORATORS_PURGE, PERMISSIONS.COLLABORATORS_MANAGE),
		captureAudit({ action: AUDIT_ACTIONS.COLLABORATOR_PERMANENTLY_DELETED, resource: 'collaborators' }),
		collaboratorPurgeController,
	);
	router.delete(
		COLLABORATOR_PATH_DELETE,
		authenticate,
		authorize(PERMISSIONS.COLLABORATORS_DELETE, PERMISSIONS.COLLABORATORS_MANAGE),
		captureAudit({ action: AUDIT_ACTIONS.COLLABORATOR_SOFT_DELETED, resource: 'collaborators' }),
		collaboratorDeleteController,
	);
}
