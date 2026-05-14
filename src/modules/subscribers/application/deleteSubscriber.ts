import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import SubscriberModel from '../infrastructure/SubscriberModel';

export async function deleteSubscriber(id: string) {
	const deleted = await SubscriberModel.findOneAndDelete({ id }).lean();

	if (!deleted) {
		AppError.notFound('ERROR_SUBSCRIBER_NOT_FOUND', 'Subscriber not found');
	}

	return cleanMongoFields(deleted);
}
