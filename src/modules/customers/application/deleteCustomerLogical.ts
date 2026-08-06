import CustomerModel from '../infrastructure/CustomerModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { CustomerNotFoundError } from '../domain/errors/CustomerErrors';

export async function deleteCustomerLogical(id: string) {
	const doc = await CustomerModel.findOne({ id, deletedAt: null });
	if (!doc) throw new CustomerNotFoundError();

	doc.deletedAt = new Date();
	await doc.save();
	return cleanMongoFields(doc.toObject());
}
