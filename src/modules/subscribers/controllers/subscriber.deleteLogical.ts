import { QueryFilter } from 'mongoose';

import { ACTIVE, DELETED } from '@Constants/statusRegister';
import { asyncHandler } from '@Middlewares/asyncHandler';
import setThrowError from '@Helpers/setThrowError';
import { successResponse } from '@Helpers/responseStructure';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';

import { SubscriberSchema } from '../types/subscriber.schema';
import SubscriberModel from '../models/subscriber.modelDB';

export const subscriberDeleteLogical = asyncHandler(
	async (request, response) => {
		const { id } = request.params;

		const query: QueryFilter<SubscriberSchema> = {
			id,
			status: ACTIVE,
		};
		const subscriber = await SubscriberModel.findOne(query).lean();

		if (!subscriber) {
			setThrowError({
				statusCode: 404,
				message: 'Subscriber not found',
				code: 'ERROR_SUBSCRIBER_NOT_FOUND',
			});
		}

		subscriber.status = DELETED;
		await SubscriberModel.findOneAndUpdate(query, subscriber, {
			new: true,
		}).lean();

		successResponse(response, {
			statusCode: 200,
			message: 'Subscriber deleted successfully',
			code: 'SUCCESS_SUBSCRIBER_DELETED',
			data: cleanMongoFields(subscriber),
		});
	},
);
