import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import CustomerModel from '../infrastructure/CustomerModel';

export async function restoreCustomer(id: string) {
	const doc = await CustomerModel.findOne({
		id,
		deletedAt: { $ne: null },
	}).lean();
	if (!doc)
		AppError.notFound('CUSTOMER_NOT_FOUND', 'Customer not found in trash');

	await CustomerModel.findOneAndUpdate(
		{ id, deletedAt: { $ne: null } },
		{ $unset: { deletedAt: '' } },
	);
	return cleanMongoFields({ ...doc, deletedAt: undefined });
}
