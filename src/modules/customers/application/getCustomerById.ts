import CustomerModel from '../infrastructure/CustomerModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { CustomerNotFoundError } from '../domain/errors/CustomerErrors';

export async function getCustomerById(id: string) {
	const doc = await CustomerModel.findOne({ id, deletedAt: null }).lean();
	if (!doc) throw new CustomerNotFoundError();
	return cleanMongoFields(doc);
}
