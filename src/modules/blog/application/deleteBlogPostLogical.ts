import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { BlogNotFoundError } from '../domain/errors/BlogErrors';
import BlogModel from '../infrastructure/BlogModel';

export async function deleteBlogPostLogical(id: string) {
	const post = await BlogModel.findOne({
		id,
		deletedAt: null,
	});
	if (!post) throw new BlogNotFoundError();

	post.deletedAt = new Date();
	await post.save();

	return cleanMongoFields(post.toObject({ versionKey: false, getters: true }));
}
