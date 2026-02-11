import { QueryFilter } from 'mongoose';

import { ACTIVE, DELETED } from '@Constants/statusRegister';
import { asyncHandler } from '@Middlewares/asyncHandler';
import setThrowError from '@Helpers/setThrowError';
import { successResponse } from '@Helpers/responseStructure';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';

import { SubscriberSchema } from '../types/subscriber.schema';
import SubscriberModel from '../models/subscriber.modelDB';

import { BulkDeleteSubscriberSchema } from '../schemas/subscriberBulkDeleteSubscriberSchema';

export const subscriberDeleteLogicalBulk = asyncHandler(
	async (request, response) => {
		const parsedBody = BulkDeleteSubscriberSchema.safeParse(request.body);

		if (!parsedBody.success) {
			setThrowError({
				statusCode: 400,
				message: parsedBody.error.issues
					.map((issue) => issue.message)
					.join(', '),
				code: 'ERROR_INVALID_BODY',
			});
		}

		const { ids } = parsedBody.data;

		const query: QueryFilter<SubscriberSchema> = {
			id: { $in: ids },
			status: ACTIVE,
		};

		const subscribers = await SubscriberModel.find(query).lean();

		const foundIds = subscribers
			.map((subscriber) => subscriber.id)
			.filter((id): id is string => Boolean(id));

		const notFoundOrInactiveIds = ids.filter((id) => !foundIds.includes(id));

		if (foundIds.length === 0) {
			successResponse(response, {
				statusCode: 200,
				message: 'No subscribers were deleted',
				code: 'SUCCESS_NO_SUBSCRIBERS_DELETED',
				data: {
					deleted: [],
					deletedIds: [],
					notFoundOrInactiveIds,
				},
			});
			return;
		}

		await SubscriberModel.updateMany(
			{ id: { $in: foundIds }, status: ACTIVE },
			{ $set: { status: DELETED } },
		);

		const cleanedSubscribers = subscribers.map((subscriber) =>
			cleanMongoFields(subscriber),
		);

		if (notFoundOrInactiveIds.length === 0) {
			successResponse(response, {
				statusCode: 200,
				message: 'Subscribers deleted successfully',
				code: 'SUCCESS_SUBSCRIBERS_DELETED',
				data: {
					deleted: cleanedSubscribers,
					deletedIds: foundIds,
					notFoundOrInactiveIds: [],
				},
			});
			return;
		}

		successResponse(response, {
			statusCode: 200,
			message: 'Subscribers deleted partially',
			code: 'SUCCESS_SUBSCRIBERS_PARTIALLY_DELETED',
			data: {
				deleted: cleanedSubscribers,
				deletedIds: foundIds,
				notFoundOrInactiveIds,
			},
		});
	},
);
