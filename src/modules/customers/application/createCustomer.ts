import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import CustomerModel from '../infrastructure/CustomerModel';
import { assertCustomerEmailUnique } from './assertCustomerEmailUnique';
import type { CreateCustomerInput } from '../schemas/customer.schema';

export async function createCustomer(input: CreateCustomerInput) {
	await assertCustomerEmailUnique(input.email);

	const doc = await CustomerModel.create(input);
	return cleanMongoFields(doc.toObject());
}
