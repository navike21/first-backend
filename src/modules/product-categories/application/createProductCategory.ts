import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import ProductCategoryModel from '../infrastructure/ProductCategoryModel';
import { ProductCategorySlugConflictError } from '../domain/errors/ProductCategoryErrors';
import { assertValidParent } from './productCategoryHierarchy';
import type { CreateProductCategoryInput } from '../schemas/productCategory.schema';

async function checkSlugConflict(
	slug?: CreateProductCategoryInput['slug'],
): Promise<void> {
	const entries = Object.entries(slug ?? {}).filter(([, v]) => v?.trim());
	if (!entries.length) return;
	const orQuery = entries.map(([lang, value]) => ({ [`slug.${lang}`]: value }));
	const existing = await ProductCategoryModel.findOne({
		$or: orQuery,
		deletedAt: null,
	});
	if (existing) throw new ProductCategorySlugConflictError();
}

export async function createProductCategory(input: CreateProductCategoryInput) {
	await assertValidParent(undefined, input.parentId);
	await checkSlugConflict(input.slug);

	const doc = await ProductCategoryModel.create(input);
	return cleanMongoFields(doc.toObject());
}
