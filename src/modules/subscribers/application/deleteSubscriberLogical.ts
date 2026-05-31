import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import SubscriberModel from '../infrastructure/SubscriberModel';

export async function deleteSubscriberLogical(id: string) {
	const subscriber = await SubscriberModel.findOne({
		id,
		deletedAt: null,
	}).lean();

	if (!subscriber) {
		AppError.notFound('ERROR_SUBSCRIBER_NOT_FOUND', 'Subscriber not found');
	}

	await SubscriberModel.findOneAndUpdate(
		{ id, deletedAt: null },
		{ $set: { deletedAt: new Date() } },
	);

	return cleanMongoFields({ ...subscriber, deletedAt: new Date() });
}
