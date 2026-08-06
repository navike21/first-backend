import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import ProductCategoryModel from '../infrastructure/ProductCategoryModel';
import {
	ProductCategoryNotFoundError,
	ProductCategorySlugConflictError,
} from '../domain/errors/ProductCategoryErrors';
import { assertValidParent } from './productCategoryHierarchy';
import type { UpdateProductCategoryInput } from '../schemas/productCategory.schema';

async function checkSlugConflict(
	id: string,
	slug?: UpdateProductCategoryInput['slug'],
): Promise<void> {
	const entries = Object.entries(slug ?? {}).filter(([, v]) => v?.trim());
	if (!entries.length) return;
	const orQuery = entries.map(([lang, value]) => ({ [`slug.${lang}`]: value }));
	const conflict = await ProductCategoryModel.findOne({
		$or: orQuery,
		id: { $ne: id },
		deletedAt: null,
	});
	if (conflict) throw new ProductCategorySlugConflictError();
}

export async function updateProductCategory(
	id: string,
	input: UpdateProductCategoryInput,
) {
	const doc = await ProductCategoryModel.findOne({ id, deletedAt: null });
	if (!doc) throw new ProductCategoryNotFoundError();

	if (input.parentId !== undefined) await assertValidParent(id, input.parentId);
	await checkSlugConflict(id, input.slug);

	Object.assign(doc, input);
	await doc.save();
	return cleanMongoFields(doc.toObject());
}
