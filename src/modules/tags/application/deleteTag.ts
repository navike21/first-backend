import TagModel from '../infrastructure/TagModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { TagNotFoundError } from '../domain/errors/TagErrors';

export async function deleteTag(id: string) {
	const doc = await TagModel.findOne({ id, deletedAt: null });
	if (!doc) throw new TagNotFoundError();

	doc.deletedAt = new Date();
	await doc.save();
	return cleanMongoFields(doc.toObject());
}
