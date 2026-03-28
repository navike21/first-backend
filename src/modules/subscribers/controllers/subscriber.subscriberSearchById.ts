import { asyncHandler } from '@Middlewares/asyncHandler';
import { QueryFilter } from 'mongoose';

import { SubscriberSchema } from '../types/subscriber.schema';
import SubscriberModel from '../models/subscriber.modelDB';
import setThrowError from '@Helpers/setThrowError';
import { successResponse } from '@Helpers/responseStructure';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';

export const subscriberSearchById = asyncHandler(async (request, response) => {
	const { id } = request.params;

	const query: QueryFilter<SubscriberSchema> = {
		id,
	};
	const subscriber = await SubscriberModel.findOne(query).lean();

	if (!subscriber) {
		setThrowError({
			statusCode: 404,
			message: 'Subscriber not found',
			code: 'ERROR_SUBSCRIBER_NOT_FOUND',
		});
	}

	successResponse(response, {
		statusCode: 200,
		message: 'Subscriber found successfully',
		code: 'SUCCESS_SUBSCRIBER_FOUND',
		data: cleanMongoFields(subscriber),
	});
});
