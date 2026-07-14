import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import TagModel from '../infrastructure/TagModel';

export async function restoreTag(id: string) {
	const doc = await TagModel.findOne({ id, deletedAt: { $ne: null } }).lean();
	if (!doc) AppError.notFound('TAG_NOT_FOUND', 'Tag not found in trash');

	await TagModel.findOneAndUpdate(
		{ id, deletedAt: { $ne: null } },
		{ $unset: { deletedAt: '' } },
	);
	return cleanMongoFields({ ...doc, deletedAt: undefined });
}
