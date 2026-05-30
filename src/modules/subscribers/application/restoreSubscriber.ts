import { ACTIVE, DELETED, StatusRegister } from '@Constants/statusRegister';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import SubscriberModel from '../infrastructure/SubscriberModel';

export async function restoreSubscriber(id: string) {
	const subscriber = await SubscriberModel.findOne({ id, status: DELETED as StatusRegister }).lean();
	if (!subscriber) AppError.notFound('SUBSCRIBER_NOT_FOUND', 'Subscriber not found in trash');

	await SubscriberModel.findOneAndUpdate(
		{ id, status: DELETED as StatusRegister },
		{ $set: { status: ACTIVE as StatusRegister } },
	);
	return cleanMongoFields({ ...subscriber, status: ACTIVE });
}
