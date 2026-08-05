import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import CategoryModel from '../infrastructure/CategoryModel';
import { CategorySlugConflictError } from '../domain/errors/CategoryErrors';
import { assertValidParent } from './categoryHierarchy';
import type { CreateCategoryInput } from '../schemas/category.schema';

async function checkSlugConflict(
	slug?: CreateCategoryInput['slug'],
): Promise<void> {
	const entries = Object.entries(slug ?? {}).filter(([, v]) => v?.trim());
	if (!entries.length) return;
	const orQuery = entries.map(([lang, value]) => ({ [`slug.${lang}`]: value }));
	const existing = await CategoryModel.findOne({
		$or: orQuery,
		deletedAt: null,
	});
	if (existing) throw new CategorySlugConflictError();
}

export async function createCategory(input: CreateCategoryInput) {
	await assertValidParent(undefined, input.parentId);
	await checkSlugConflict(input.slug);

	const doc = await CategoryModel.create(input);
	return cleanMongoFields(doc.toObject());
}
