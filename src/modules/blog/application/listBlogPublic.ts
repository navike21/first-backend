import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { metaInformation } from '@Helpers/metaInformation';
import BlogModel from '../infrastructure/BlogModel';
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
	const skip = (page - 1) * limit;
	const query: Record<string, unknown> = { ...publicVisibilityFilter() };
	if (categoryId) query.categoryIds = categoryId;
	if (tagId) query.tagIds = tagId;

	const [data, total] = await Promise.all([
		BlogModel.find(query)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.select({ content: 0 })
			.lean(),
		BlogModel.countDocuments(query),
	]);

	return {
		data: data.map(cleanMongoFields),
		meta: metaInformation({ page, limit, total }),
	};
}
