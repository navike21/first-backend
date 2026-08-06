import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import CustomerModel from '../infrastructure/CustomerModel';
import { CustomerNotFoundError } from '../domain/errors/CustomerErrors';
import { assertCustomerEmailUnique } from './assertCustomerEmailUnique';
import type { UpdateCustomerInput } from '../schemas/customer.schema';

export async function updateCustomer(id: string, input: UpdateCustomerInput) {
	const doc = await CustomerModel.findOne({ id, deletedAt: null });
	if (!doc) throw new CustomerNotFoundError();

	if (input.email !== undefined) {
		await assertCustomerEmailUnique(input.email, id);
	}

	Object.assign(doc, input);
	await doc.save();
	return cleanMongoFields(doc.toObject());
}
