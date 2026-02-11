import { type Router } from 'express';

import {
	SUBSCRIBER_PATH_DELETE,
	SUBSCRIBER_PATH_DELETE_BULK,
	SUBSCRIBER_PATH_DELETE_LOGIC,
	SUBSCRIBER_PATH_DELETE_LOGIC_BULK,
	SUBSCRIBER_PATH_LIST,
	SUBSCRIBER_PATH_REGISTER,
	SUBSCRIBER_PATH_REGISTER_BULK,
	SUBSCRIBER_PATH_SEARCH_BY_ID,
	SUBSCRIBER_PATH_UPDATE,
} from '../constants/paths';

import { validateSchema } from '../middlewares/validateSchema';
import { validateSchemaArray } from '../middlewares/validateSchemaArray';

import { SubscriberRegisterSchema } from '../schemas/subscriber.schema';
import { SubscriberUpdateSchema } from '../schemas/subscriber.updateSchema';

import { subscriberRegister } from '../controllers/subscriber.register';
import { subscriberListAll } from '../controllers/subscriber.listAll';
import { subscriberSearchById } from '../controllers/subscriber.subscriberSearchById';
import { subscriberDeleteLogical } from '../controllers/subscriber.deleteLogical';
import { subscriberRegisterBulk } from '../controllers/subscriber.registerBulk';
import { subscriberDeleteLogicalBulk } from '../controllers/subscriber.deleteLogicalBulk';
import { subscriberDeletePhysical } from '../controllers/subscriber.delete';
import { subscriberDeletePhysicalBulk } from '../controllers/subscriber.deleteBulk';
import { subscriberUpdate } from '../controllers/subscriber.update';
import { validateUpdateSchema } from '../middlewares/validateUpdateSchema';

export function subscribersApi(router: Router) {
	router.post(
		SUBSCRIBER_PATH_REGISTER,
		validateSchema(SubscriberRegisterSchema),
		subscriberRegister,
	);
	router.post(
		SUBSCRIBER_PATH_REGISTER_BULK,
		validateSchemaArray(SubscriberRegisterSchema),
		subscriberRegisterBulk,
	);

	router.get(SUBSCRIBER_PATH_LIST, subscriberListAll);
	router.get(SUBSCRIBER_PATH_SEARCH_BY_ID, subscriberSearchById);

	router.delete(SUBSCRIBER_PATH_DELETE_LOGIC, subscriberDeleteLogical);
	router.delete(SUBSCRIBER_PATH_DELETE_LOGIC_BULK, subscriberDeleteLogicalBulk);
	router.delete(SUBSCRIBER_PATH_DELETE, subscriberDeletePhysical);
	router.delete(SUBSCRIBER_PATH_DELETE_BULK, subscriberDeletePhysicalBulk);

	router.patch(
		SUBSCRIBER_PATH_UPDATE,
		validateUpdateSchema(SubscriberUpdateSchema),
		subscriberUpdate,
	);
}
