import { Router } from 'express';

import {
	CLIENT_PATH_DELETE,
	CLIENT_PATH_DELETE_BULK,
	CLIENT_PATH_DELETE_LOGIC,
	CLIENT_PATH_DELETE_LOGIC_BULK,
	CLIENT_PATH_LIST,
	CLIENT_PATH_REGISTER,
	CLIENT_PATH_REGISTER_BULK,
	CLIENT_PATH_SEARCH_BY_ID,
	CLIENT_PATH_UPDATE,
} from '../constants/paths';

import { validateSchema } from '../middlewares/validateSchema';
import { validateSchemaArray } from '../middlewares/validateSchemaArray';
import { validateUpdateSchema } from '../middlewares/validateUpdateSchema';

import { ClientRegisterSchema } from '../schemas/client.schema';
import { ClientUpdateSchema } from '../schemas/client.updateSchema';

import { clientRegister } from '../controllers/client.register';
import { clientRegisterBulk } from '../controllers/client.registerBulk';
import { clientListAll } from '../controllers/client.listAll';
import { clientSearchById } from '../controllers/client.searchById';
import { clientDeleteLogical } from '../controllers/client.deleteLogical';
import { clientDeleteLogicalBulk } from '../controllers/client.deleteLogicalBulk';
import { clientDeletePhysical } from '../controllers/client.delete';
import { clientDeletePhysicalBulk } from '../controllers/client.deleteBulk';
import { clientUpdate } from '../controllers/client.update';

export function clientsApi(router: Router) {
	router.post(
		CLIENT_PATH_REGISTER,
		validateSchema(ClientRegisterSchema),
		clientRegister,
	);
	router.post(
		CLIENT_PATH_REGISTER_BULK,
		validateSchemaArray(ClientRegisterSchema),
		clientRegisterBulk,
	);

	router.get(CLIENT_PATH_LIST, clientListAll);
	router.get(CLIENT_PATH_SEARCH_BY_ID, clientSearchById);

	router.delete(CLIENT_PATH_DELETE_LOGIC, clientDeleteLogical);
	router.delete(CLIENT_PATH_DELETE_LOGIC_BULK, clientDeleteLogicalBulk);
	router.delete(CLIENT_PATH_DELETE, clientDeletePhysical);
	router.delete(CLIENT_PATH_DELETE_BULK, clientDeletePhysicalBulk);

	router.patch(
		CLIENT_PATH_UPDATE,
		validateUpdateSchema(ClientUpdateSchema),
		clientUpdate,
	);
}
