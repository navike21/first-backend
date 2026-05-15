import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import SubscriberModel from '../infrastructure/SubscriberModel';

export async function searchSubscriberById(id: string) {
	const subscriber = await SubscriberModel.findOne({ id }).lean();

	if (!subscriber) {
		AppError.notFound('ERROR_SUBSCRIBER_NOT_FOUND', 'Subscriber not found');
	}

	return cleanMongoFields(subscriber);
}
