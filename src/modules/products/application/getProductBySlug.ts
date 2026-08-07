import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { SUPPORTED_LANGUAGES } from '@Shared/types/localizedString';
import { ProductNotFoundError } from '../domain/errors/ProductErrors';
import ProductModel from '../infrastructure/ProductModel';

export async function getProductBySlug(slug: string) {
	const product = await ProductModel.findOne({
		$or: SUPPORTED_LANGUAGES.map((l) => ({ [`slug.${l}`]: slug })),
		status: 'active',
		deletedAt: null,
	}).lean();
	if (!product) throw new ProductNotFoundError();
	return cleanMongoFields(product);
}
