import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import FormSubmissionModel from '../infrastructure/FormSubmissionModel';

interface ListFormSubmissionsOptions {
	formId: string;
	page: number;
	limit: number;
	isRead?: boolean;
}

export async function listFormSubmissions({
	formId,
	page,
	limit,
	isRead,
}: ListFormSubmissionsOptions) {
	const filter: Record<string, unknown> = { formId, deletedAt: null };
	if (isRead !== undefined) filter.isRead = isRead;

	const [docs, total] = await Promise.all([
		FormSubmissionModel.find(filter)
			.sort({ createdAt: -1 })
			.skip((page - 1) * limit)
			.limit(limit)
			.lean(),
		FormSubmissionModel.countDocuments(filter),
	]);

	return {
		data: docs.map(cleanMongoFields),
		meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
	};
}
