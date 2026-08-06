import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import { deleteEntityFiles } from '@Modules/storage';
import BlogModel from '../infrastructure/BlogModel';
import { BLOG_ENTITY_TYPE } from '../constants/paths';

export async function deleteBlogPostPhysical(id: string) {
	const post = await BlogModel.findOne({
		id,
		deletedAt: { $ne: null },
	}).lean();
	if (!post) AppError.notFound('BLOG_NOT_FOUND', 'Blog post not found in trash');

	await BlogModel.deleteOne({ id });
	await deleteEntityFiles(BLOG_ENTITY_TYPE, id).catch(() => {});
	return cleanMongoFields(post);
}
