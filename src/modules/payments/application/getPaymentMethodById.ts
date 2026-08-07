import PaymentMethodModel from '../infrastructure/PaymentMethodModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { PaymentMethodNotFoundError } from '../domain/errors/PaymentErrors';

export async function getPaymentMethodById(id: string) {
	const doc = await PaymentMethodModel.findOne({ id, deletedAt: null }).lean();
	if (!doc) throw new PaymentMethodNotFoundError();
	return cleanMongoFields(doc);
}
