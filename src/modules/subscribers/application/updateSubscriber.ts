import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import setThrowError from '@Helpers/setThrowError';
import SubscriberModel from '../infrastructure/SubscriberModel';
import { SubscriberSchema } from '../types/subscriber.schema';

export async function updateSubscriber(id: string, data: Partial<SubscriberSchema>) {
	const updated = await SubscriberModel.findOneAndUpdate(
		{ id },
		{ $set: data },
		{ new: true, runValidators: true },
	);

	if (!updated) {
		setThrowError({
			statusCode: 404,
			message: 'Subscriber not found',
			code: 'SUBSCRIBER_NOT_FOUND',
		});
	}

	return cleanMongoFields(updated.toObject({ versionKey: false, getters: true }));
}
