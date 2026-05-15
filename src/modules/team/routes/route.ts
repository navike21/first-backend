import { Router } from 'express';
import { authenticate } from '@Modules/auth/middlewares/authenticate';
import { authorize } from '@Modules/auth/middlewares/authorize';
import { PERMISSIONS } from '@Constants/permissions';
import { captureAudit } from '@Modules/audit-log/middlewares/captureAudit';
import { AUDIT_ACTIONS } from '@Modules/audit-log/constants/auditActions';
import {
	TEAM_PATH_LIST_PUBLIC,
	TEAM_PATH_LIST_ADMIN,
	TEAM_PATH_GET_BY_ID,
	TEAM_PATH_CREATE,
	TEAM_PATH_UPDATE,
	TEAM_PATH_DELETE,
} from '../constants/paths';
import {
	teamListPublicController,
	teamListAdminController,
} from '../controllers/team.list';
import { teamGetByIdController } from '../controllers/team.getById';
import { teamCreateController } from '../controllers/team.create';
import { teamUpdateController } from '../controllers/team.update';
import { teamDeleteController } from '../controllers/team.delete';

export function teamApi(router: Router) {
	router.get(TEAM_PATH_LIST_PUBLIC, teamListPublicController);

	router.get(
		TEAM_PATH_LIST_ADMIN,
		authenticate,
		authorize(PERMISSIONS.TEAM_READ, PERMISSIONS.TEAM_MANAGE),
		teamListAdminController,
	);

	router.get(TEAM_PATH_GET_BY_ID, teamGetByIdController);

	router.post(
		TEAM_PATH_CREATE,
		authenticate,
		authorize(PERMISSIONS.TEAM_CREATE, PERMISSIONS.TEAM_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.TEAM_MEMBER_CREATED,
			resource: 'team',
		}),
		teamCreateController,
	);

	router.patch(
		TEAM_PATH_UPDATE,
		authenticate,
		authorize(PERMISSIONS.TEAM_UPDATE, PERMISSIONS.TEAM_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.TEAM_MEMBER_UPDATED,
			resource: 'team',
		}),
		teamUpdateController,
	);

	router.delete(
		TEAM_PATH_DELETE,
		authenticate,
		authorize(PERMISSIONS.TEAM_DELETE, PERMISSIONS.TEAM_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.TEAM_MEMBER_SOFT_DELETED,
			resource: 'team',
		}),
		teamDeleteController,
	);
}
