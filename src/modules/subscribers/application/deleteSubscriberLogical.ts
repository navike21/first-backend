import { ACTIVE, DELETED } from '@Constants/statusRegister';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import SubscriberModel from '../infrastructure/SubscriberModel';

export async function deleteSubscriberLogical(id: string) {
	const subscriber = await SubscriberModel.findOne({
		id,
		status: ACTIVE,
	}).lean();

	if (!subscriber) {
		AppError.notFound('ERROR_SUBSCRIBER_NOT_FOUND', 'Subscriber not found');
	}

	await SubscriberModel.findOneAndUpdate(
		{ id, status: ACTIVE },
		{ $set: { status: DELETED } },
	);

	return cleanMongoFields({ ...subscriber, status: DELETED });
}
