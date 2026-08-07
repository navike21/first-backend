import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import PaymentMethodModel from '../infrastructure/PaymentMethodModel';
import { PaymentMethodNotFoundError } from '../domain/errors/PaymentErrors';
import type { UpdatePaymentMethodInput } from '../schemas/paymentMethod.schema';

export async function updatePaymentMethod(id: string, input: UpdatePaymentMethodInput) {
	const doc = await PaymentMethodModel.findOne({ id, deletedAt: null });
	if (!doc) throw new PaymentMethodNotFoundError();

	Object.assign(doc, input);
	await doc.save();
	return cleanMongoFields(doc.toObject());
}
