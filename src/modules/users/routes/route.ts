import { Router } from 'express';
import { authorize, authenticate } from '@Modules/auth';
import { PERMISSIONS } from '@Constants/permissions';
import { AUDIT_ACTIONS } from '@Modules/audit-log/constants/auditActions';
import { captureAudit } from '@Modules/audit-log/middlewares/captureAudit';
import { createUserController } from '../controllers/user.create';
import { listUsersController } from '../controllers/user.list';
import { getUserByIdController } from '../controllers/user.getById';
import { updateUserController } from '../controllers/user.update';
import { deleteUserController } from '../controllers/user.delete';
import { deleteUserLogicalController } from '../controllers/user.deleteLogical';
import {
	getMyProfileController,
	updateMyProfileController,
} from '../controllers/user.profile';
import { updatePresenceController } from '../controllers/user.presence';
import { getUserMetadataController } from '../controllers/user.metadata';
import { userRestoreController } from '../controllers/user.restore';
import { userTrashController } from '../controllers/user.trash';
import { deleteUsersBulkController } from '../controllers/user.deleteBulk';
import { restoreUsersBulkController } from '../controllers/user.restoreBulk';
import { purgeUsersBulkController } from '../controllers/user.purgeBulk';

export function usersApi(router: Router) {
	router.get('/users/metadata', authenticate, getUserMetadataController);
	router.get('/users/me', authenticate, getMyProfileController);
	router.patch('/users/me', authenticate, updateMyProfileController);
	router.patch('/users/me/presence', authenticate, updatePresenceController);

	router.post(
		'/users',
		authenticate,
		authorize(PERMISSIONS.USERS_CREATE, PERMISSIONS.USERS_MANAGE),
		createUserController,
	);

	// Trash
	router.get(
		'/users/trash',
		authenticate,
		authorize(PERMISSIONS.USERS_READ, PERMISSIONS.USERS_MANAGE),
		userTrashController,
	);

	// List & Detail
	router.get(
		'/users',
		authenticate,
		authorize(PERMISSIONS.USERS_READ, PERMISSIONS.USERS_MANAGE),
		listUsersController,
	);
	router.get(
		'/users/:id',
		authenticate,
		authorize(PERMISSIONS.USERS_READ, PERMISSIONS.USERS_MANAGE),
		getUserByIdController,
	);

	// Update
	router.patch(
		'/users/:id',
		authenticate,
		authorize(PERMISSIONS.USERS_UPDATE, PERMISSIONS.USERS_MANAGE),
		updateUserController,
	);

	// Restore individual
	router.patch(
		'/users/:id/restore',
		authenticate,
		authorize(PERMISSIONS.USERS_UPDATE, PERMISSIONS.USERS_MANAGE),
		captureAudit({ action: AUDIT_ACTIONS.USERS_RESTORED, resource: 'users' }),
		userRestoreController,
	);

	// Bulk operations
	router.delete(
		'/users/bulk',
		authenticate,
		authorize(PERMISSIONS.USERS_DELETE, PERMISSIONS.USERS_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.USERS_BULK_SOFT_DELETED,
			resource: 'users',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		deleteUsersBulkController,
	);
	router.patch(
		'/users/bulk/restore',
		authenticate,
		authorize(PERMISSIONS.USERS_UPDATE, PERMISSIONS.USERS_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.USERS_BULK_RESTORED,
			resource: 'users',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		restoreUsersBulkController,
	);
	router.delete(
		'/users/bulk/permanent',
		authenticate,
		authorize(PERMISSIONS.USERS_PURGE, PERMISSIONS.USERS_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.USERS_BULK_PERMANENTLY_DELETED,
			resource: 'users',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		purgeUsersBulkController,
	);

	// Soft delete individual
	router.delete(
		'/users/:id',
		authenticate,
		authorize(PERMISSIONS.USERS_DELETE, PERMISSIONS.USERS_MANAGE),
		captureAudit({ action: AUDIT_ACTIONS.USERS_SOFT_DELETED, resource: 'users' }),
		deleteUserLogicalController,
	);

	// Purge individual (eliminación física — solo desde papelera)
	router.delete(
		'/users/:id/permanent',
		authenticate,
		authorize(PERMISSIONS.USERS_PURGE, PERMISSIONS.USERS_MANAGE),
		captureAudit({ action: AUDIT_ACTIONS.USERS_DELETED, resource: 'users' }),
		deleteUserController,
	);
}
