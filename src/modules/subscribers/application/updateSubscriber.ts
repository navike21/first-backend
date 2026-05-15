import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import SubscriberModel from '../infrastructure/SubscriberModel';
import { SubscriberSchema } from '../types/subscriber.schema';

export async function updateSubscriber(
	id: string,
	data: Partial<SubscriberSchema>,
) {
	const updated = await SubscriberModel.findOneAndUpdate(
		{ id },
		{ $set: data },
		{ new: true, runValidators: true },
	);

	if (!updated) {
		AppError.notFound('SUBSCRIBER_NOT_FOUND', 'Subscriber not found');
	}

	return cleanMongoFields(
		updated.toObject({ versionKey: false, getters: true }),
	);
}
