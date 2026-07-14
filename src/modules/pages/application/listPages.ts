import PageModel from '../infrastructure/PageModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { escapeRegex } from '@Helpers/escapeRegex';
import { publicVisibilityFilter, withEffectiveStatus } from './pageStatus';

interface ListPagesOptions {
	page: number;
	limit: number;
	adminView?: boolean;
	search?: string;
	status?: string;
	parentId?: string;
}

export async function listPages({
	page,
	limit,
	adminView = false,
	search,
	status,
	parentId,
}: ListPagesOptions) {
	const filter: Record<string, unknown> = adminView
		? { deletedAt: null }
		: publicVisibilityFilter();

	if (search) {
		const pattern = escapeRegex(search);
		filter.$or = [
			'en',
			'es',
			'de',
			'fr',
			'it',
			'ja',
			'ko',
			'pt',
			'ru',
			'zh',
		].map((lang) => ({
			[`title.${lang}`]: { $regex: pattern, $options: 'i' },
		}));
	}
	if (adminView && status) filter.status = status;
	if (adminView && parentId !== undefined) filter.parentId = parentId;

	const [docs, total] = await Promise.all([
		PageModel.find(filter)
			.sort({ createdAt: -1 })
			.skip((page - 1) * limit)
			.limit(limit)
			.lean(),
		PageModel.countDocuments(filter),
	]);

	return {
		data: docs.map((doc) => withEffectiveStatus(cleanMongoFields(doc))),
		meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
	};
}
