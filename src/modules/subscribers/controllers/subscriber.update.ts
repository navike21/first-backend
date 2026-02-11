import { asyncHandler } from '@Middlewares/asyncHandler';
import SubscriberModel from '../models/subscriber.modelDB';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { successResponse } from '@Helpers/responseStructure';
import setThrowError from '@Helpers/setThrowError';

export const subscriberUpdate = asyncHandler(async (request, response) => {
	const subscriberId = request.params.id;
	const subscriberRequest = request.body;

	const updatedSubscriber = await SubscriberModel.findOneAndUpdate(
		{ id: subscriberId },
		{ $set: subscriberRequest },
		{ new: true, runValidators: true },
	);

	if (!updatedSubscriber) {
		setThrowError({
			statusCode: 404,
			message: 'Subscriber not found',
			code: 'SUBSCRIBER_NOT_FOUND',
		});
	}

	const dataResponse = cleanMongoFields(
		updatedSubscriber.toObject({ versionKey: false, getters: true }),
	);

	successResponse(response, {
		statusCode: 200,
		message: 'Subscriber updated successfully',
		code: 'SUCCESS_SUBSCRIBER_UPDATE',
		data: dataResponse,
	});
});
