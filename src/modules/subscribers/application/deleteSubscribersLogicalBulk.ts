import { ACTIVE, DELETED } from '@Constants/statusRegister';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import SubscriberModel from '../infrastructure/SubscriberModel';

export async function deleteSubscribersLogicalBulk(ids: string[]) {
	const subscribers = await SubscriberModel.find({
		id: { $in: ids },
		status: ACTIVE,
	}).lean();

	const foundIds = subscribers
		.map((s) => s.id)
		.filter((id): id is string => Boolean(id));

	const notFoundOrInactiveIds = ids.filter((id) => !foundIds.includes(id));

	if (foundIds.length === 0) {
		return { deleted: [], deletedIds: [], notFoundOrInactiveIds };
	}

	await SubscriberModel.updateMany(
		{ id: { $in: foundIds }, status: ACTIVE },
		{ $set: { status: DELETED } },
	);

	return {
		deleted: subscribers.map((s) => cleanMongoFields(s)),
		deletedIds: foundIds,
		notFoundOrInactiveIds,
	};
}
