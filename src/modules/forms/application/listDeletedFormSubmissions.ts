import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import FormSubmissionModel from '../infrastructure/FormSubmissionModel';

export async function listDeletedFormSubmissions({
	formId,
	page,
	limit,
}: {
	formId: string;
	page: number;
	limit: number;
}) {
	const filter = { formId, deletedAt: { $ne: null } };
	const [data, total] = await Promise.all([
		FormSubmissionModel.find(filter)
			.sort({ deletedAt: -1 })
			.skip((page - 1) * limit)
			.limit(limit)
			.lean(),
		FormSubmissionModel.countDocuments(filter),
	]);
	return {
		data: data.map(cleanMongoFields),
		meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
	};
}
