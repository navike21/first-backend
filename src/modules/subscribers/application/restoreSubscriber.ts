import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import SubscriberModel from '../infrastructure/SubscriberModel';

export async function restoreSubscriber(id: string) {
	const subscriber = await SubscriberModel.findOne({
		id,
		deletedAt: { $ne: null },
	}).lean();
	if (!subscriber)
		AppError.notFound('SUBSCRIBER_NOT_FOUND', 'Subscriber not found in trash');

	await SubscriberModel.findOneAndUpdate(
		{ id, deletedAt: { $ne: null } },
		{ $unset: { deletedAt: '' } },
	);
	return cleanMongoFields({ ...subscriber, deletedAt: undefined });
}
