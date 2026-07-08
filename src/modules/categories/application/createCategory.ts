import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import CategoryModel from '../infrastructure/CategoryModel';
import { CategorySlugConflictError } from '../domain/errors/CategoryErrors';
import { assertValidParent } from './categoryHierarchy';
import type { CreateCategoryInput } from '../schemas/category.schema';

export async function createCategory(input: CreateCategoryInput) {
	await assertValidParent(undefined, input.parentId);

	const existing = await CategoryModel.findOne({ slug: input.slug, deletedAt: null });
	if (existing) throw new CategorySlugConflictError();

	const doc = await CategoryModel.create(input);
	return cleanMongoFields(doc.toObject());
}
