import { Router } from 'express';

import {
	USER_PATH_DELETE_LOGIC,
	USER_PATH_LOGIN,
	USER_PATH_REGISTER,
	USER_PATH_SEARCH_BY_ID,
} from '../constants/paths';
import { userRegister } from '../controllers/user.register';
import { userListAll } from '../controllers/user.listAll';
import { userSearchById } from '../controllers/user.userSearchById';
import { validateSchema } from '../middlewares/validateSchema';
import { UserZodSchema } from '../schemas/user.schema';
import { userDeleteLogical } from '../controllers/user.deleteLogical';

export function usersApi(router: Router) {
	router.post(USER_PATH_REGISTER, validateSchema(UserZodSchema), userRegister);
	router.get(USER_PATH_LOGIN, userListAll);
	router.get(USER_PATH_SEARCH_BY_ID, userSearchById);
	router.delete(USER_PATH_DELETE_LOGIC, userDeleteLogical);
}
