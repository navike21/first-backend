import { QueryFilter } from 'mongoose';
import { ACTIVE, StatusRegister } from '@Constants/statusRegister';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { metaInformation } from '@Helpers/metaInformation';
import setThrowError from '@Helpers/setThrowError';
import SubscriberModel from '../infrastructure/SubscriberModel';
import { SubscriberSchema } from '../types/subscriber.schema';

interface ListAllParams {
	limit: number;
	page: number;
	status?: string;
}

export async function listAllSubscribers({
	limit,
	page,
	status,
}: ListAllParams) {
	const skip = (page - 1) * limit;
	const query: QueryFilter<SubscriberSchema> = {
		status: (status ?? ACTIVE) as StatusRegister,
	};

	const [data, total] = await Promise.all([
		SubscriberModel.find(query)
			.skip(skip)
			.limit(limit)
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

	return {
		data: data.map((item) => cleanMongoFields(item)),
		meta: metaInformation({ page, limit, total }),
	};
}
