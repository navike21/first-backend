import { Router } from 'express';
import { authorize, authenticate } from '@Modules/auth';
import { PERMISSIONS } from '@Constants/permissions';
import { createUserController } from '../controllers/user.create';
import { listUsersController } from '../controllers/user.list';
import { getUserByIdController } from '../controllers/user.getById';
import { updateUserController } from '../controllers/user.update';
import { deleteUserController } from '../controllers/user.delete';
import {
	getMyProfileController,
	updateMyProfileController,
} from '../controllers/user.profile';

export function usersApi(router: Router) {
	router.get('/users/me', authenticate, getMyProfileController);
	router.patch('/users/me', authenticate, updateMyProfileController);

	router.post(
		'/users',
		authenticate,
		authorize(PERMISSIONS.USERS_CREATE, PERMISSIONS.USERS_MANAGE),
		createUserController,
	);
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
	router.patch(
		'/users/:id',
		authenticate,
		authorize(PERMISSIONS.USERS_UPDATE, PERMISSIONS.USERS_MANAGE),
		updateUserController,
	);
	router.delete(
		'/users/:id',
		authenticate,
		authorize(PERMISSIONS.USERS_DELETE, PERMISSIONS.USERS_MANAGE),
		deleteUserController,
	);
}
