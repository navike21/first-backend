import { asyncHandler } from '@Middlewares/asyncHandler';
import setThrowError from '@Helpers/setThrowError';
import { successResponse } from '@Helpers/responseStructure';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';

import SubscriberModel from '../models/subscriber.modelDB';

export const subscriberDeletePhysical = asyncHandler(
	async (request, response) => {
		const { id } = request.params;

		const deletedSubscriber = await SubscriberModel.findOneAndDelete({
			id,
		}).lean();

		if (!deletedSubscriber) {
			setThrowError({
				statusCode: 404,
				message: 'Subscriber not found',
				code: 'ERROR_SUBSCRIBER_NOT_FOUND',
			});
		}

		successResponse(response, {
			statusCode: 200,
			message: 'Subscriber permanently deleted successfully',
			code: 'SUCCESS_SUBSCRIBER_DELETED_PHYSICAL',
			data: cleanMongoFields(deletedSubscriber),
		});
	},
);
