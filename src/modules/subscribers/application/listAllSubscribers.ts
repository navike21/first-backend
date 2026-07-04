import { QueryFilter } from 'mongoose';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { metaInformation } from '@Helpers/metaInformation';
import SubscriberModel from '../infrastructure/SubscriberModel';
import { SubscriberSchema } from '../types/subscriber.schema';

interface ListAllParams {
	limit: number;
	page: number;
	status?: string;
	search?: string;
}

export async function listAllSubscribers({
	limit,
	page,
	status,
	search,
}: ListAllParams) {
	const skip = (page - 1) * limit;
	const query: QueryFilter<SubscriberSchema> = {
		deletedAt: null,
	};

	if (status) {
		query.status = status;
	}

	if (search) {
		const regex = new RegExp(search, 'i');
		query.$or = [
			{ firstName: regex },
			{ lastName: regex },
			{ 'contactInformation.email': regex },
		];
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
				status: 1,
			})
			.lean(),
		SubscriberModel.countDocuments(query),
	]);

	return {
		data: data.map((item) => cleanMongoFields(item)),
		meta: metaInformation({ page, limit, total }),
	};
}
