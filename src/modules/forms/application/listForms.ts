import FormModel from '../infrastructure/FormModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { escapeRegex } from '@Helpers/escapeRegex';

interface ListFormsOptions {
	page: number;
	limit: number;
	search?: string;
	status?: 'active' | 'inactive';
}

export async function listForms({
	page,
	limit,
	search,
	status,
}: ListFormsOptions) {
	const filter: Record<string, unknown> = { deletedAt: null };

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
	if (status) filter.status = status;

	const [docs, total] = await Promise.all([
		FormModel.find(filter)
			.sort({ createdAt: -1 })
			.skip((page - 1) * limit)
			.limit(limit)
			.lean(),
		FormModel.countDocuments(filter),
	]);

	return {
		data: docs.map(cleanMongoFields),
		meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
	};
}
