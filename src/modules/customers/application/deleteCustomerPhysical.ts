import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import CustomerModel from '../infrastructure/CustomerModel';

export async function deleteCustomerPhysical(id: string) {
	const doc = await CustomerModel.findOne({
		id,
		deletedAt: { $ne: null },
	}).lean();
	if (!doc)
		AppError.notFound('CUSTOMER_NOT_FOUND', 'Customer not found in trash');

	await CustomerModel.deleteOne({ id });
	return cleanMongoFields(doc);
}
