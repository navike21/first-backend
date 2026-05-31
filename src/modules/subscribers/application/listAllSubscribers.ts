import { QueryFilter } from 'mongoose';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { metaInformation } from '@Helpers/metaInformation';
import { AppError } from '@Shared/domain/AppError';
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
		deletedAt: null,
	};

	if (status) {
		query.status = status;
	}

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
		AppError.notFound('SUBSCRIBER_LIST_EMPTY', 'Subscriber list empty');
	}

	return {
		data: data.map((item) => cleanMongoFields(item)),
		meta: metaInformation({ page, limit, total }),
	};
}
