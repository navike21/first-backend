import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import SubscriberModel from '../infrastructure/SubscriberModel';
import type { UpdateSubscriberInput } from '../schemas/subscriber.updateSchema';

export async function updateSubscriber(
	id: string,
	data: UpdateSubscriberInput,
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
