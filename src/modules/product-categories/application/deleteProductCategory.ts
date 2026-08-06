import ProductCategoryModel from '../infrastructure/ProductCategoryModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { ProductCategoryNotFoundError } from '../domain/errors/ProductCategoryErrors';

export async function deleteProductCategory(id: string) {
	const doc = await ProductCategoryModel.findOne({ id, deletedAt: null });
	if (!doc) throw new ProductCategoryNotFoundError();

	doc.deletedAt = new Date();
	await doc.save();
	return cleanMongoFields(doc.toObject());
}
