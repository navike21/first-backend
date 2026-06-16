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
import { deleteUserGroupsBulkController } from '../controllers/userGroup.deleteBulk';
import { restoreUserGroupsBulkController } from '../controllers/userGroup.restoreBulk';
import { purgeUserGroupsBulkController } from '../controllers/userGroup.purgeBulk';
import { listGroupMembersController } from '../controllers/userGroup.members.list';
import { addGroupMembersController } from '../controllers/userGroup.members.add';
import { removeGroupMemberController } from '../controllers/userGroup.members.remove';

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

	// Bulk operations (before :id routes to avoid conflicts)
	router.delete(
		'/user-groups/bulk',
		authenticate,
		authorize(PERMISSIONS.USER_GROUPS_DELETE, PERMISSIONS.USER_GROUPS_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.USER_GROUPS_BULK_SOFT_DELETED,
			resource: 'user-groups',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		deleteUserGroupsBulkController,
	);
	router.patch(
		'/user-groups/bulk/restore',
		authenticate,
		authorize(PERMISSIONS.USER_GROUPS_UPDATE, PERMISSIONS.USER_GROUPS_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.USER_GROUPS_BULK_RESTORED,
			resource: 'user-groups',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		restoreUserGroupsBulkController,
	);
	router.delete(
		'/user-groups/bulk/permanent',
		authenticate,
		authorize(PERMISSIONS.USER_GROUPS_PURGE),
		captureAudit({
			action: AUDIT_ACTIONS.USER_GROUPS_BULK_PERMANENTLY_DELETED,
			resource: 'user-groups',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		purgeUserGroupsBulkController,
	);

	// Membership (users that belong to a group). Membership lives in
	// `User.groupIds`, so these require BOTH user-groups AND users permissions
	// (the two authorize() guards are AND-ed; each accepts its own `:manage`/`*:*`).
	router.get(
		'/user-groups/:id/members',
		authenticate,
		authorize(PERMISSIONS.USERS_READ, PERMISSIONS.USERS_MANAGE),
		authorize(PERMISSIONS.USER_GROUPS_READ, PERMISSIONS.USER_GROUPS_MANAGE),
		listGroupMembersController,
	);
	router.post(
		'/user-groups/:id/members',
		authenticate,
		authorize(PERMISSIONS.USERS_UPDATE, PERMISSIONS.USERS_MANAGE),
		authorize(PERMISSIONS.USER_GROUPS_UPDATE, PERMISSIONS.USER_GROUPS_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.USER_GROUPS_MEMBERS_ADDED,
			resource: 'user-groups',
			getMetadata: (req) => ({
				groupId: req.params.id,
				userIds: req.body.userIds,
			}),
		}),
		addGroupMembersController,
	);
	router.delete(
		'/user-groups/:id/members/:userId',
		authenticate,
		authorize(PERMISSIONS.USERS_UPDATE, PERMISSIONS.USERS_MANAGE),
		authorize(PERMISSIONS.USER_GROUPS_UPDATE, PERMISSIONS.USER_GROUPS_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.USER_GROUPS_MEMBER_REMOVED,
			resource: 'user-groups',
			getMetadata: (req) => ({
				groupId: req.params.id,
				userId: req.params.userId,
			}),
		}),
		removeGroupMemberController,
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

	// Soft delete individual
	router.delete(
		'/user-groups/:id',
		authenticate,
		authorize(PERMISSIONS.USER_GROUPS_DELETE, PERMISSIONS.USER_GROUPS_MANAGE),
		captureAudit({ action: AUDIT_ACTIONS.USER_GROUPS_SOFT_DELETED, resource: 'user-groups' }),
		deleteUserGroupLogicalController,
	);

	// Purge individual (eliminación física — solo desde papelera)
	router.delete(
		'/user-groups/:id/permanent',
		authenticate,
		authorize(PERMISSIONS.USER_GROUPS_PURGE),
		captureAudit({ action: AUDIT_ACTIONS.USER_GROUPS_DELETED, resource: 'user-groups' }),
		deleteUserGroupController,
	);
}
