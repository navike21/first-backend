import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { SUPPORTED_LANGUAGES } from '@Shared/types/localizedString';
import CollaboratorModel from '@Modules/collaborators/infrastructure/CollaboratorModel';
import { BlogNotFoundError } from '../domain/errors/BlogErrors';
import BlogModel from '../infrastructure/BlogModel';
import { publicVisibilityFilter } from './blogPostStatus';

export async function getBlogPostBySlug(slug: string) {
	const post = await BlogModel.findOne({
		$or: SUPPORTED_LANGUAGES.map((l) => ({ [`slug.${l}`]: slug })),
		...publicVisibilityFilter(),
	}).lean();
	if (!post) throw new BlogNotFoundError();

	const cleaned = cleanMongoFields(post);

	const authorDoc = post.authorId
		? await CollaboratorModel.findOne({
				id: post.authorId,
				deletedAt: null,
			})
				.select({ name: 1, role: 1, photoUrl: 1 })
				.lean()
		: null;
	const author = authorDoc ? cleanMongoFields(authorDoc) : null;

	return { ...cleaned, author };
}
