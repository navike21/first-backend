import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import TagModel from '../infrastructure/TagModel';
import { TagSlugConflictError } from '../domain/errors/TagErrors';
import type { CreateTagInput } from '../schemas/tag.schema';

async function checkSlugConflict(slug?: CreateTagInput['slug']): Promise<void> {
	const entries = Object.entries(slug ?? {}).filter(([, v]) => v?.trim());
	if (!entries.length) return;
	const orQuery = entries.map(([lang, value]) => ({ [`slug.${lang}`]: value }));
	const existing = await TagModel.findOne({ $or: orQuery, deletedAt: null });
	if (existing) throw new TagSlugConflictError();
}

export async function createTag(input: CreateTagInput) {
	await checkSlugConflict(input.slug);

	const doc = await TagModel.create(input);
	return cleanMongoFields(doc.toObject());
}
