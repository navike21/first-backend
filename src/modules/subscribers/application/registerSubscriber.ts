import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import SubscriberModel from '../infrastructure/SubscriberModel';
import { SubscriberSchema } from '../types/subscriber.schema';

export async function registerSubscriber(data: SubscriberSchema) {
	const created = await SubscriberModel.create(data);
	return cleanMongoFields(
		created.toObject({ versionKey: false, getters: true }),
	);
}
