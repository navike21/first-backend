import PageModel from '../infrastructure/PageModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';

interface ListPagesOptions {
	page: number;
	limit: number;
	adminView?: boolean;
}

export async function listPages({
	page,
	limit,
	adminView = false,
}: ListPagesOptions) {
	const filter: Record<string, unknown> = adminView
		? { deletedAt: null }
		: { status: 'published', isPublished: true, deletedAt: null };

	const [docs, total] = await Promise.all([
		PageModel.find(filter)
			.sort({ createdAt: -1 })
			.skip((page - 1) * limit)
			.limit(limit)
			.lean(),
		PageModel.countDocuments(filter),
	]);

	return {
		data: docs.map(cleanMongoFields),
		meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
	};
}
