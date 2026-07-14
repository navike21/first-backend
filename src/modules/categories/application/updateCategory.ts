import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import CategoryModel from '../infrastructure/CategoryModel';
import {
	CategoryNotFoundError,
	CategorySlugConflictError,
} from '../domain/errors/CategoryErrors';
import { assertValidParent } from './categoryHierarchy';
import type { UpdateCategoryInput } from '../schemas/category.schema';

export async function updateCategory(id: string, input: UpdateCategoryInput) {
	const doc = await CategoryModel.findOne({ id, deletedAt: null });
	if (!doc) throw new CategoryNotFoundError();

	if (input.parentId !== undefined) await assertValidParent(id, input.parentId);

	if (input.slug && input.slug !== doc.slug) {
		const conflict = await CategoryModel.findOne({
			slug: input.slug,
			id: { $ne: id },
			deletedAt: null,
		});
		if (conflict) throw new CategorySlugConflictError();
	}

	Object.assign(doc, input);
	await doc.save();
	return cleanMongoFields(doc.toObject());
}
