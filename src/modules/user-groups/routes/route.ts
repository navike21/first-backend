import { Router } from 'express';
import { authorize, authenticate } from '@Modules/auth';
import { PERMISSIONS } from '@Constants/permissions';
import { createUserGroupController } from '../controllers/userGroup.create';
import { listUserGroupsController } from '../controllers/userGroup.list';
import { getUserGroupByIdController } from '../controllers/userGroup.getById';
import { updateUserGroupController } from '../controllers/userGroup.update';
import { deleteUserGroupController } from '../controllers/userGroup.delete';
import { listPermissionCatalogController } from '../controllers/userGroup.permissions';

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
	router.delete(
		'/user-groups/:id',
		authenticate,
		authorize(PERMISSIONS.USER_GROUPS_DELETE, PERMISSIONS.USER_GROUPS_MANAGE),
		deleteUserGroupController,
	);
}
