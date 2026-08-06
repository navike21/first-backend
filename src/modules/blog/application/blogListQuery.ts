import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { metaInformation } from '@Helpers/metaInformation';
import BlogModel from '../infrastructure/BlogModel';

export interface RunBlogListQueryParams {
	page: number;
	limit: number;
	query: Record<string, unknown>;
	/** Fields to exclude from each result (e.g. `{ content: 0 }` for the
	 * public list, which doesn't need the full post body). */
	exclude?: Record<string, 0>;
}

/** Shared find+count+paginate shape behind both listBlogAdmin and
 * listBlogPublic — only the Mongo filter (and whether to exclude `content`)
 * differs between them. */
export async function runBlogListQuery({
	page,
	limit,
	query,
	exclude,
}: RunBlogListQueryParams) {
	const skip = (page - 1) * limit;

	const [data, total] = await Promise.all([
		BlogModel.find(query)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.select(exclude ?? {})
			.lean(),
		BlogModel.countDocuments(query),
	]);

	return {
		data: data.map(cleanMongoFields),
		meta: metaInformation({ page, limit, total }),
	};
}
