import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import PaymentMethodModel from '../infrastructure/PaymentMethodModel';

export async function deletePaymentMethodPhysical(id: string) {
	const doc = await PaymentMethodModel.findOne({
		id,
		deletedAt: { $ne: null },
	}).lean();
	if (!doc)
		AppError.notFound('PAYMENT_METHOD_NOT_FOUND', 'Payment method not found in trash');

	await PaymentMethodModel.deleteOne({ id });
	return cleanMongoFields(doc);
}
