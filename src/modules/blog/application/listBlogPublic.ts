import { runBlogListQuery } from './blogListQuery';
import { publicVisibilityFilter } from './blogPostStatus';

interface ListBlogPublicParams {
	page: number;
	limit: number;
	categoryId?: string;
	tagId?: string;
}

export async function listBlogPublic({
	page,
	limit,
	categoryId,
	tagId,
}: ListBlogPublicParams) {
	const query: Record<string, unknown> = { ...publicVisibilityFilter() };
	if (categoryId) query.categoryIds = categoryId;
	if (tagId) query.tagIds = tagId;

	return runBlogListQuery({ page, limit, query, exclude: { content: 0 } });
}
