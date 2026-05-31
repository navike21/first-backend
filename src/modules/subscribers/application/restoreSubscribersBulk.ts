import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import SubscriberModel from '../infrastructure/SubscriberModel';

export async function restoreSubscribersBulk(ids: string[]) {
	const subscribers = await SubscriberModel.find({ id: { $in: ids }, deletedAt: { $ne: null } }).lean();

	const processedIds = subscribers.map((s) => s.id).filter((id): id is string => Boolean(id));
	const notFoundIds = ids.filter((id) => !processedIds.includes(id));

	if (processedIds.length === 0) {
		return { processed: [], processedIds: [], notFoundIds };
	}

	await SubscriberModel.updateMany(
		{ id: { $in: processedIds }, deletedAt: { $ne: null } },
		{ $unset: { deletedAt: '' } },
	);

	return {
		processed: subscribers.map((s) => cleanMongoFields({ ...s, deletedAt: undefined })),
		processedIds,
		notFoundIds,
	};
}
