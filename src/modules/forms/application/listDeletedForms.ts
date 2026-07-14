import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import FormModel from '../infrastructure/FormModel';

export async function listDeletedForms({
	page,
	limit,
}: {
	page: number;
	limit: number;
}) {
	const filter = { deletedAt: { $ne: null } };
	const [data, total] = await Promise.all([
		FormModel.find(filter)
			.sort({ deletedAt: -1 })
			.skip((page - 1) * limit)
			.limit(limit)
			.lean(),
		FormModel.countDocuments(filter),
	]);
	return {
		data: data.map(cleanMongoFields),
		meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
	};
}
