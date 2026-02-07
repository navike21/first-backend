import { Router } from 'express';

import { USER_PATH_LOGIN, USER_PATH_REGISTER } from '../constants/paths';
import { userRegister } from '../controllers/user.register';
import { userListAll } from '../controllers/user.listAll';

export function usersApi(router: Router) {
	router.post(USER_PATH_REGISTER, userRegister);
	router.get(USER_PATH_LOGIN, userListAll);
}
