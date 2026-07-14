import TagModel from '../infrastructure/TagModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { escapeRegex } from '@Helpers/escapeRegex';

interface ListTagsOptions {
	page: number;
	limit: number;
	adminView?: boolean;
	search?: string;
	isActive?: boolean;
}

export async function listTags({ page, limit, adminView = false, search, isActive }: ListTagsOptions) {
	const filter: Record<string, unknown> = adminView ? { deletedAt: null } : { status: 'active', isActive: true, deletedAt: null };

	if (search) {
		const pattern = escapeRegex(search);
		filter.$or = ['en', 'es', 'de', 'fr', 'it', 'ja', 'ko', 'pt', 'ru', 'zh'].map((lang) => ({
			[`name.${lang}`]: { $regex: pattern, $options: 'i' },
		}));
	}
	if (adminView && isActive !== undefined) filter.isActive = isActive;

	const [docs, total] = await Promise.all([
		TagModel.find(filter)
			.sort({ order: 1, createdAt: 1 })
			.skip((page - 1) * limit)
			.limit(limit)
			.lean(),
		TagModel.countDocuments(filter),
	]);

	return {
		data: docs.map(cleanMongoFields),
		meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
	};
}
