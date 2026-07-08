import TagModel from '../infrastructure/TagModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';

export async function purgeTag(id: string) {
	const doc = await TagModel.findOne({ id, deletedAt: { $ne: null } }).lean();
	if (!doc) AppError.notFound('TAG_NOT_FOUND', 'Tag not found in trash');

	await TagModel.deleteOne({ id });
	return cleanMongoFields(doc);
}
