import { asyncHandler } from '@Middlewares/asyncHandler';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { successResponse } from '@Helpers/responseStructure';

import { SubscriberSchema } from '../types/subscriber.schema';
import SubscriberModel from '../models/subscriber.modelDB';

export const subscriberRegister = asyncHandler(async (request, response) => {
	const subscriberRequest = request.body as SubscriberSchema;

	const registerResponse = await SubscriberModel.create(subscriberRequest);
	const dataResponse = cleanMongoFields(
		registerResponse.toObject({ versionKey: false, getters: true }),
	);

	successResponse(response, {
		statusCode: 201,
		message: 'Subscriber registered successfully',
		code: 'SUCCESS_SUBSCRIBER_REGISTER',
		data: dataResponse,
	});
});
