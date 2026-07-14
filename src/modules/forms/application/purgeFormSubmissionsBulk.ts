import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import FormSubmissionModel from '../infrastructure/FormSubmissionModel';

export async function purgeFormSubmissionsBulk(formId: string, ids: string[]) {
	const docs = await FormSubmissionModel.find({
		id: { $in: ids },
		formId,
		deletedAt: { $ne: null },
	}).lean();
	const processedIds = docs
		.map((d) => d.id)
		.filter((id): id is string => Boolean(id));
	const notFoundIds = ids.filter((id) => !processedIds.includes(id));

	if (processedIds.length === 0) {
		return { processed: [], processedIds: [], notFoundIds };
	}

	await FormSubmissionModel.deleteMany({ id: { $in: processedIds }, formId });

	return {
		processed: docs.map((d) => cleanMongoFields(d)),
		processedIds,
		notFoundIds,
	};
}
