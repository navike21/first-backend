import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import setThrowError from '@Helpers/setThrowError';
import SubscriberModel from '../infrastructure/SubscriberModel';

export async function deleteSubscriber(id: string) {
	const deleted = await SubscriberModel.findOneAndDelete({ id }).lean();

	if (!deleted) {
		setThrowError({
			statusCode: 404,
			message: 'Subscriber not found',
			code: 'ERROR_SUBSCRIBER_NOT_FOUND',
		});
	}

	return cleanMongoFields(deleted);
}
