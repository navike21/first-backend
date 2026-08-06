import ProductCategoryModel from '../infrastructure/ProductCategoryModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import { ProductCategoryHasChildrenError } from '../domain/errors/ProductCategoryErrors';

export async function purgeProductCategory(id: string) {
	const doc = await ProductCategoryModel.findOne({
		id,
		deletedAt: { $ne: null },
	}).lean();
	if (!doc)
		AppError.notFound(
			'PRODUCT_CATEGORY_NOT_FOUND',
			'Product category not found in trash',
		);

	const hasChildren = await ProductCategoryModel.exists({
		parentId: id,
		deletedAt: null,
	});
	if (hasChildren) throw new ProductCategoryHasChildrenError();

	await ProductCategoryModel.deleteOne({ id });
	return cleanMongoFields(doc);
}
