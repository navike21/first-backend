import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { metaInformation } from '@Helpers/metaInformation';
import BlogModel from '../infrastructure/BlogModel';
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
	const skip = (page - 1) * limit;
	const query: Record<string, unknown> = { deletedAt: null };
	if (status) query.status = status;
	if (categoryId) query.categoryIds = categoryId;
	if (tagId) query.tagIds = tagId;

	const [data, total] = await Promise.all([
		BlogModel.find(query)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.lean(),
		BlogModel.countDocuments(query),
	]);

	return {
		data: data.map(cleanMongoFields),
		meta: metaInformation({ page, limit, total }),
	};
}
