import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { metaInformation } from '@Helpers/metaInformation';
import SubscriberModel from '../infrastructure/SubscriberModel';

export async function listDeletedSubscribers({ page, limit }: { page: number; limit: number }) {
	const skip = (page - 1) * limit;
	const [data, total] = await Promise.all([
		SubscriberModel.find({ deletedAt: { $ne: null } })
			.sort({ deletedAt: -1 })
			.skip(skip)
			.limit(limit)
			.select({ id: 1, firstName: 1, lastName: 1, contactInformation: 1, personalInformation: 1, status: 1, deletedAt: 1 })
			.lean(),
		SubscriberModel.countDocuments({ deletedAt: { $ne: null } }),
	]);
	return { data: data.map(cleanMongoFields), meta: metaInformation({ page, limit, total }) };
}
