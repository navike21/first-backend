import ProductCategoryModel from '../infrastructure/ProductCategoryModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { ProductCategoryNotFoundError } from '../domain/errors/ProductCategoryErrors';

export async function getProductCategoryById(id: string) {
	const doc = await ProductCategoryModel.findOne({
		id,
		deletedAt: null,
	}).lean();
	if (!doc) throw new ProductCategoryNotFoundError();
	return cleanMongoFields(doc);
}
