import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import TagModel from '../infrastructure/TagModel';
import { TagSlugConflictError } from '../domain/errors/TagErrors';
import type { CreateTagInput } from '../schemas/tag.schema';

export async function createTag(input: CreateTagInput) {
	const existing = await TagModel.findOne({ slug: input.slug, deletedAt: null });
	if (existing) throw new TagSlugConflictError();

	const doc = await TagModel.create(input);
	return cleanMongoFields(doc.toObject());
}
