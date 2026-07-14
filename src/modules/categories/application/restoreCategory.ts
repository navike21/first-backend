import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import CategoryModel from '../infrastructure/CategoryModel';

export async function restoreCategory(id: string) {
	const doc = await CategoryModel.findOne({
		id,
		deletedAt: { $ne: null },
	}).lean();
	if (!doc)
		AppError.notFound('CATEGORY_NOT_FOUND', 'Category not found in trash');

	await CategoryModel.findOneAndUpdate(
		{ id, deletedAt: { $ne: null } },
		{ $unset: { deletedAt: '' } },
	);
	return cleanMongoFields({ ...doc, deletedAt: undefined });
}
