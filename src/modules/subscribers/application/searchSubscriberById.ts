import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import setThrowError from '@Helpers/setThrowError';
import SubscriberModel from '../infrastructure/SubscriberModel';

export async function searchSubscriberById(id: string) {
	const subscriber = await SubscriberModel.findOne({ id }).lean();

	if (!subscriber) {
		setThrowError({
			statusCode: 404,
			message: 'Subscriber not found',
			code: 'ERROR_SUBSCRIBER_NOT_FOUND',
		});
	}

	return cleanMongoFields(subscriber);
}
