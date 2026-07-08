import TagModel from '../infrastructure/TagModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { TagNotFoundError } from '../domain/errors/TagErrors';

export async function getTagById(id: string) {
	const doc = await TagModel.findOne({ id, deletedAt: null }).lean();
	if (!doc) throw new TagNotFoundError();
	return cleanMongoFields(doc);
}
