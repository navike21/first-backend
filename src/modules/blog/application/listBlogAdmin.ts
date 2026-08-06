import { runBlogListQuery } from './blogListQuery';
import type { BlogStatus } from '../constants/blogStatus';

interface ListBlogAdminParams {
	page: number;
	limit: number;
	status?: BlogStatus;
	categoryId?: string;
	tagId?: string;
}

export async function listBlogAdmin({
	page,
	limit,
	status,
	categoryId,
	tagId,
}: ListBlogAdminParams) {
	const query: Record<string, unknown> = { deletedAt: null };
	if (status) query.status = status;
	if (categoryId) query.categoryIds = categoryId;
	if (tagId) query.tagIds = tagId;

	return runBlogListQuery({ page, limit, query });
}
