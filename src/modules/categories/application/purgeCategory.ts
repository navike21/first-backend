import CategoryModel from '../infrastructure/CategoryModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import { CategoryHasChildrenError } from '../domain/errors/CategoryErrors';

export async function purgeCategory(id: string) {
	const doc = await CategoryModel.findOne({
		id,
		deletedAt: { $ne: null },
	}).lean();
	if (!doc)
		AppError.notFound('CATEGORY_NOT_FOUND', 'Category not found in trash');

	const hasChildren = await CategoryModel.exists({
		parentId: id,
		deletedAt: null,
	});
	if (hasChildren) throw new CategoryHasChildrenError();

	await CategoryModel.deleteOne({ id });
	return cleanMongoFields(doc);
}
