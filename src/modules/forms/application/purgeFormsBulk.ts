import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import FormModel from '../infrastructure/FormModel';
import FormSubmissionModel from '../infrastructure/FormSubmissionModel';

export async function purgeFormsBulk(ids: string[]) {
	const docs = await FormModel.find({
		id: { $in: ids },
		deletedAt: { $ne: null },
	}).lean();
	const processedIds = docs
		.map((d) => d.id)
		.filter((id): id is string => Boolean(id));
	const notFoundIds = ids.filter((id) => !processedIds.includes(id));

	if (processedIds.length === 0) {
		return { processed: [], processedIds: [], notFoundIds };
	}

	await FormModel.deleteMany({ id: { $in: processedIds } });
	await FormSubmissionModel.deleteMany({ formId: { $in: processedIds } });

	return {
		processed: docs.map((d) => cleanMongoFields(d)),
		processedIds,
		notFoundIds,
	};
}
