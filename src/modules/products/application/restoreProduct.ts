import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import ProductModel from '../infrastructure/ProductModel';

export async function restoreProduct(id: string) {
	const doc = await ProductModel.findOne({
		id,
		deletedAt: { $ne: null },
	}).lean();
	if (!doc)
		AppError.notFound('PRODUCT_NOT_FOUND', 'Product not found in trash');

	await ProductModel.findOneAndUpdate(
		{ id, deletedAt: { $ne: null } },
		{ $unset: { deletedAt: '' } },
	);
	return cleanMongoFields({ ...doc, deletedAt: undefined });
}
