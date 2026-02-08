import { Router } from 'express';

import {
	USER_PATH_DELETE,
	USER_PATH_DELETE_BULK,
	USER_PATH_DELETE_LOGIC,
	USER_PATH_DELETE_LOGIC_BULK,
	USER_PATH_LOGIN,
	USER_PATH_REGISTER,
	USER_PATH_REGISTER_BULK,
	USER_PATH_SEARCH_BY_ID,
} from '../constants/paths';

import { validateSchema } from '../middlewares/validateSchema';
import { validateSchemaArray } from '../middlewares/validateSchemaArray';
import { UserZodSchema } from '../schemas/user.schema';

import { userRegister } from '../controllers/user.register';
import { userListAll } from '../controllers/user.listAll';
import { userSearchById } from '../controllers/user.userSearchById';
import { userDeleteLogical } from '../controllers/user.deleteLogical';
import { userRegisterBulk } from '../controllers/user.registerBulk';
import { userDeleteLogicalBulk } from '../controllers/user.deleteLogicalBulk';
import { userDeletePhysical } from '../controllers/user.delete';
import { userDeletePhysicalBulk } from '../controllers/user.deleteBulk';

export function usersApi(router: Router) {
	router.post(USER_PATH_REGISTER, validateSchema(UserZodSchema), userRegister);
	router.post(
		USER_PATH_REGISTER_BULK,
		validateSchemaArray(UserZodSchema),
		userRegisterBulk,
	);

	router.get(USER_PATH_LOGIN, userListAll);
	router.get(USER_PATH_SEARCH_BY_ID, userSearchById);

	router.delete(USER_PATH_DELETE_LOGIC, userDeleteLogical);
	router.delete(USER_PATH_DELETE_LOGIC_BULK, userDeleteLogicalBulk);
	router.delete(USER_PATH_DELETE, userDeletePhysical);
	router.delete(USER_PATH_DELETE_BULK, userDeletePhysicalBulk);
}
