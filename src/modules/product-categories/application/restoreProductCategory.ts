import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import ProductCategoryModel from '../infrastructure/ProductCategoryModel';

export async function restoreProductCategory(id: string) {
	const doc = await ProductCategoryModel.findOne({
		id,
		deletedAt: { $ne: null },
	}).lean();
	if (!doc)
		AppError.notFound(
			'PRODUCT_CATEGORY_NOT_FOUND',
			'Product category not found in trash',
		);

	await ProductCategoryModel.findOneAndUpdate(
		{ id, deletedAt: { $ne: null } },
		{ $unset: { deletedAt: '' } },
	);
	return cleanMongoFields({ ...doc, deletedAt: undefined });
}
