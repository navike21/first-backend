import PaymentMethodModel from '../infrastructure/PaymentMethodModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { PaymentMethodNotFoundError } from '../domain/errors/PaymentErrors';

export async function deletePaymentMethodLogical(id: string) {
	const doc = await PaymentMethodModel.findOne({ id, deletedAt: null });
	if (!doc) throw new PaymentMethodNotFoundError();

	doc.deletedAt = new Date();
	await doc.save();
	return cleanMongoFields(doc.toObject());
}
