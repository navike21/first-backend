import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import SubscriberModel from '../infrastructure/SubscriberModel';

export async function deleteSubscribersBulk(ids: string[]) {
	const subscribers = await SubscriberModel.find({ id: { $in: ids }, deletedAt: { $ne: null } }).lean();

	const foundIds = subscribers
		.map((s) => s.id)
		.filter((id): id is string => Boolean(id));

	const notFoundIds = ids.filter((id) => !foundIds.includes(id));

	if (foundIds.length === 0) {
		return { deleted: [], deletedIds: [], notFoundIds };
	}

	await SubscriberModel.deleteMany({ id: { $in: foundIds } });

	return {
		deleted: subscribers.map((s) => cleanMongoFields(s)),
		deletedIds: foundIds,
		notFoundIds,
	};
}
