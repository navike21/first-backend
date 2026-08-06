import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import BlogModel from '../infrastructure/BlogModel';

export async function restoreBlogPost(id: string) {
	const item = await BlogModel.findOne({
		id,
		deletedAt: { $ne: null },
	}).lean();
	if (!item) AppError.notFound('BLOG_NOT_FOUND', 'Blog post not found in trash');

	await BlogModel.findOneAndUpdate(
		{ id, deletedAt: { $ne: null } },
		{ $unset: { deletedAt: '' } },
	);
	return cleanMongoFields({ ...item, deletedAt: undefined });
}
