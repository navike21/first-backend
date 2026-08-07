import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import { deleteEntityFiles } from '@Modules/storage';
import ProductModel from '../infrastructure/ProductModel';
import { PRODUCT_ENTITY_TYPE } from '../constants/paths';

export async function deleteProductPhysical(id: string) {
	const product = await ProductModel.findOne({
		id,
		deletedAt: { $ne: null },
	}).lean();
	if (!product)
		AppError.notFound('PRODUCT_NOT_FOUND', 'Product not found in trash');

	await ProductModel.deleteOne({ id });
	await deleteEntityFiles(PRODUCT_ENTITY_TYPE, id).catch(() => {});
	return cleanMongoFields(product);
}
