import { QueryFilter } from 'mongoose';

import { ACTIVE } from '@Constants/statusRegister';
import { successResponse } from '@Helpers/responseStructure';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { metaInformation, paramsInformation } from '@Helpers/metaInformation';
import setThrowError from '@Helpers/setThrowError';
import { asyncHandler } from '@Middlewares/asyncHandler';

import SubscriberModel from '../models/subscriber.modelDB';
import { SubscriberSchema } from '../types/subscriber.schema';

export const subscriberListAll = asyncHandler(async (request, response) => {
	const { limitNumber, pageNumber, statusParam, skip } =
		paramsInformation(request);

	const query: QueryFilter<SubscriberSchema> = {
		status: statusParam ?? ACTIVE,
	};

	const [data, total] = await Promise.all([
		SubscriberModel.find(query)
			.skip(skip)
			.limit(limitNumber)
			.select({
				id: 1,
				firstName: 1,
				lastName: 1,
				contactInformation: 1,
				personalInformation: 1,
			})
			.lean(),
		SubscriberModel.countDocuments(query),
	]);

	if (data.length === 0) {
		setThrowError({
			statusCode: 404,
			message: 'Subscriber list empty',
			code: 'SUBSCRIBER_LIST_EMPTY',
		});
	}

	const meta = metaInformation({
		page: pageNumber,
		limit: limitNumber,
		total,
	});

	const cleanedSubscriberList = data.map((item) => cleanMongoFields(item));

	successResponse(response, {
		statusCode: 200,
		message: 'Subscriber list retrieved successfully',
		code: 'SUCCESS_SUBSCRIBER_LIST',
		data: cleanedSubscriberList,
		meta,
	});
});
