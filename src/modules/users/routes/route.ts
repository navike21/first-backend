import { Router } from 'express';

import { USER_PATH_REGISTER } from '../constants/paths';
import { userRegister } from '../controllers/user.register';

export function usersApi(router: Router) {
	router.post(USER_PATH_REGISTER, userRegister);
}
