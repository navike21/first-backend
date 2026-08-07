import ProductModel from '../infrastructure/ProductModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { ProductNotFoundError } from '../domain/errors/ProductErrors';

export async function deleteProductLogical(id: string) {
	const doc = await ProductModel.findOne({ id, deletedAt: null });
	if (!doc) throw new ProductNotFoundError();

	doc.deletedAt = new Date();
	await doc.save();
	return cleanMongoFields(doc.toObject());
}
