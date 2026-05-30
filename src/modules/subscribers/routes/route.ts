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

import { authenticate } from '@Modules/auth';
import { authorize } from '@Modules/auth';
import { PERMISSIONS } from '@Constants/permissions';

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
	// Public — subscribe form
	router.post(
		SUBSCRIBER_PATH_REGISTER,
		validateSchema(SubscriberRegisterSchema),
		subscriberRegister,
	);

	// Admin — protected routes
	router.post(
		SUBSCRIBER_PATH_REGISTER_BULK,
		authenticate,
		authorize(PERMISSIONS.SUBSCRIBERS_CREATE, PERMISSIONS.SUBSCRIBERS_MANAGE),
		validateSchemaArray(SubscriberRegisterSchema),
		subscriberRegisterBulk,
	);

	router.get(
		SUBSCRIBER_PATH_LIST,
		authenticate,
		authorize(PERMISSIONS.SUBSCRIBERS_READ, PERMISSIONS.SUBSCRIBERS_MANAGE),
		subscriberListAll,
	);
	router.get(
		SUBSCRIBER_PATH_SEARCH_BY_ID,
		authenticate,
		authorize(PERMISSIONS.SUBSCRIBERS_READ, PERMISSIONS.SUBSCRIBERS_MANAGE),
		subscriberSearchById,
	);

	router.delete(
		SUBSCRIBER_PATH_DELETE_LOGIC,
		authenticate,
		authorize(PERMISSIONS.SUBSCRIBERS_DELETE, PERMISSIONS.SUBSCRIBERS_MANAGE),
		subscriberDeleteLogical,
	);
	router.delete(
		SUBSCRIBER_PATH_DELETE_LOGIC_BULK,
		authenticate,
		authorize(PERMISSIONS.SUBSCRIBERS_DELETE, PERMISSIONS.SUBSCRIBERS_MANAGE),
		subscriberDeleteLogicalBulk,
	);
	router.delete(
		SUBSCRIBER_PATH_DELETE,
		authenticate,
		authorize(PERMISSIONS.SUBSCRIBERS_PURGE, PERMISSIONS.SUBSCRIBERS_MANAGE),
		subscriberDeletePhysical,
	);
	router.delete(
		SUBSCRIBER_PATH_DELETE_BULK,
		authenticate,
		authorize(PERMISSIONS.SUBSCRIBERS_PURGE, PERMISSIONS.SUBSCRIBERS_MANAGE),
		subscriberDeletePhysicalBulk,
	);

	router.patch(
		SUBSCRIBER_PATH_UPDATE,
		authenticate,
		authorize(PERMISSIONS.SUBSCRIBERS_UPDATE, PERMISSIONS.SUBSCRIBERS_MANAGE),
		validateUpdateSchema(SubscriberUpdateSchema),
		subscriberUpdate,
	);
}
