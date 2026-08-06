import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { BlogNotFoundError } from '../domain/errors/BlogErrors';
import BlogModel from '../infrastructure/BlogModel';

export async function getBlogPostById(id: string) {
	const post = await BlogModel.findOne({
		id,
		deletedAt: null,
	}).lean();
	if (!post) throw new BlogNotFoundError();
	return cleanMongoFields(post);
}
