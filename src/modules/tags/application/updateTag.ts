import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import TagModel from '../infrastructure/TagModel';
import {
	TagNotFoundError,
	TagSlugConflictError,
} from '../domain/errors/TagErrors';
import type { UpdateTagInput } from '../schemas/tag.schema';

export async function updateTag(id: string, input: UpdateTagInput) {
	const doc = await TagModel.findOne({ id, deletedAt: null });
	if (!doc) throw new TagNotFoundError();

	if (input.slug && input.slug !== doc.slug) {
		const conflict = await TagModel.findOne({
			slug: input.slug,
			id: { $ne: id },
			deletedAt: null,
		});
		if (conflict) throw new TagSlugConflictError();
	}

	Object.assign(doc, input);
	await doc.save();
	return cleanMongoFields(doc.toObject());
}
