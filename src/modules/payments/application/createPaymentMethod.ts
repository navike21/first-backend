import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import PaymentMethodModel from '../infrastructure/PaymentMethodModel';
import type { CreatePaymentMethodInput } from '../schemas/paymentMethod.schema';

export async function createPaymentMethod(input: CreatePaymentMethodInput) {
	const doc = await PaymentMethodModel.create(input);
	return cleanMongoFields(doc.toObject());
}
