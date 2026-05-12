import { ACTIVE, DELETED } from '@Constants/statusRegister';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import setThrowError from '@Helpers/setThrowError';
import SubscriberModel from '../infrastructure/SubscriberModel';

export async function deleteSubscriberLogical(id: string) {
	const subscriber = await SubscriberModel.findOne({
		id,
		status: ACTIVE,
	}).lean();

	if (!subscriber) {
		setThrowError({
			statusCode: 404,
			message: 'Subscriber not found',
			code: 'ERROR_SUBSCRIBER_NOT_FOUND',
		});
	}

	await SubscriberModel.findOneAndUpdate(
		{ id, status: ACTIVE },
		{ $set: { status: DELETED } },
	);

	return cleanMongoFields({ ...subscriber, status: DELETED });
}
