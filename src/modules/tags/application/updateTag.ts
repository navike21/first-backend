import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import TagModel from '../infrastructure/TagModel';
import {
	TagNotFoundError,
	TagSlugConflictError,
} from '../domain/errors/TagErrors';
import type { UpdateTagInput } from '../schemas/tag.schema';

async function checkSlugConflict(
	id: string,
	slug?: UpdateTagInput['slug'],
): Promise<void> {
	const entries = Object.entries(slug ?? {}).filter(([, v]) => v?.trim());
	if (!entries.length) return;
	const orQuery = entries.map(([lang, value]) => ({ [`slug.${lang}`]: value }));
	const conflict = await TagModel.findOne({
		$or: orQuery,
		id: { $ne: id },
		deletedAt: null,
	});
	if (conflict) throw new TagSlugConflictError();
}

export async function updateTag(id: string, input: UpdateTagInput) {
	const doc = await TagModel.findOne({ id, deletedAt: null });
	if (!doc) throw new TagNotFoundError();
	await checkSlugConflict(id, input.slug);

	Object.assign(doc, input);
	await doc.save();
	return cleanMongoFields(doc.toObject());
}
