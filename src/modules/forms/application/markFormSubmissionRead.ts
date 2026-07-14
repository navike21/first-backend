import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import FormSubmissionModel from '../infrastructure/FormSubmissionModel';
import { FormSubmissionNotFoundError } from '../domain/errors/FormErrors';

export async function markFormSubmissionRead(formId: string, id: string) {
	const doc = await FormSubmissionModel.findOneAndUpdate(
		{ id, formId, deletedAt: null },
		{ $set: { isRead: true } },
		{ new: true },
	).lean();
	if (!doc) throw new FormSubmissionNotFoundError();
	return cleanMongoFields(doc);
}
