import { Router } from 'express';
import { authorize, authenticate } from '@Modules/auth';
import { PERMISSIONS } from '@Constants/permissions';
import { AUDIT_ACTIONS } from '@Modules/audit-log/constants/auditActions';
import { captureAudit } from '@Modules/audit-log/middlewares/captureAudit';
import { createUserGroupController } from '../controllers/userGroup.create';
import { listUserGroupsController } from '../controllers/userGroup.list';
import { getUserGroupByIdController } from '../controllers/userGroup.getById';
import { updateUserGroupController } from '../controllers/userGroup.update';
import { deleteUserGroupController } from '../controllers/userGroup.delete';
import { deleteUserGroupLogicalController } from '../controllers/userGroup.deleteLogical';
import { listPermissionCatalogController } from '../controllers/userGroup.permissions';
import { userGroupRestoreController } from '../controllers/userGroup.restore';
import { userGroupTrashController } from '../controllers/userGroup.trash';

export function userGroupsApi(router: Router) {
	router.get(
		'/permissions/catalog',
		authenticate,
		listPermissionCatalogController,
	);

	router.post(
		'/user-groups',
		authenticate,
		authorize(PERMISSIONS.USER_GROUPS_CREATE, PERMISSIONS.USER_GROUPS_MANAGE),
		createUserGroupController,
	);
	router.get(
		'/user-groups/trash',
		authenticate,
		authorize(PERMISSIONS.USER_GROUPS_READ, PERMISSIONS.USER_GROUPS_MANAGE),
		userGroupTrashController,
	);
	router.get(
		'/user-groups',
		authenticate,
		authorize(PERMISSIONS.USER_GROUPS_READ, PERMISSIONS.USER_GROUPS_MANAGE),
		listUserGroupsController,
	);
	router.get(
		'/user-groups/:id',
		authenticate,
		authorize(PERMISSIONS.USER_GROUPS_READ, PERMISSIONS.USER_GROUPS_MANAGE),
		getUserGroupByIdController,
	);
	router.patch(
		'/user-groups/:id',
		authenticate,
		authorize(PERMISSIONS.USER_GROUPS_UPDATE, PERMISSIONS.USER_GROUPS_MANAGE),
		updateUserGroupController,
	);
	router.patch(
		'/user-groups/:id/restore',
		authenticate,
		authorize(PERMISSIONS.USER_GROUPS_UPDATE, PERMISSIONS.USER_GROUPS_MANAGE),
		captureAudit({ action: AUDIT_ACTIONS.USER_GROUPS_RESTORED, resource: 'user-groups' }),
		userGroupRestoreController,
	);
	router.delete(
		'/user-groups/:id/soft',
		authenticate,
		authorize(PERMISSIONS.USER_GROUPS_DELETE, PERMISSIONS.USER_GROUPS_MANAGE),
		deleteUserGroupLogicalController,
	);
	router.delete(
		'/user-groups/:id',
		authenticate,
		authorize(PERMISSIONS.USER_GROUPS_PURGE, PERMISSIONS.USER_GROUPS_MANAGE),
		deleteUserGroupController,
	);
}
