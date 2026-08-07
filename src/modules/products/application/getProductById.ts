import ProductModel from '../infrastructure/ProductModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { ProductNotFoundError } from '../domain/errors/ProductErrors';

export async function getProductById(id: string) {
	const doc = await ProductModel.findOne({ id, deletedAt: null }).lean();
	if (!doc) throw new ProductNotFoundError();
	return cleanMongoFields(doc);
}
