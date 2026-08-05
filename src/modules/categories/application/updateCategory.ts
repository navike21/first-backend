import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import CategoryModel from '../infrastructure/CategoryModel';
import {
	CategoryNotFoundError,
	CategorySlugConflictError,
} from '../domain/errors/CategoryErrors';
import { assertValidParent } from './categoryHierarchy';
import type { UpdateCategoryInput } from '../schemas/category.schema';

async function checkSlugConflict(
	id: string,
	slug?: UpdateCategoryInput['slug'],
): Promise<void> {
	const entries = Object.entries(slug ?? {}).filter(([, v]) => v?.trim());
	if (!entries.length) return;
	const orQuery = entries.map(([lang, value]) => ({ [`slug.${lang}`]: value }));
	const conflict = await CategoryModel.findOne({
		$or: orQuery,
		id: { $ne: id },
		deletedAt: null,
	});
	if (conflict) throw new CategorySlugConflictError();
}

export async function updateCategory(id: string, input: UpdateCategoryInput) {
	const doc = await CategoryModel.findOne({ id, deletedAt: null });
	if (!doc) throw new CategoryNotFoundError();

	if (input.parentId !== undefined) await assertValidParent(id, input.parentId);
	await checkSlugConflict(id, input.slug);

	Object.assign(doc, input);
	await doc.save();
	return cleanMongoFields(doc.toObject());
}
