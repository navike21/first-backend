import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import FormSubmissionModel from '../infrastructure/FormSubmissionModel';
import { FormSubmissionNotFoundError } from '../domain/errors/FormErrors';

export async function deleteFormSubmission(formId: string, id: string) {
	const doc = await FormSubmissionModel.findOne({
		id,
		formId,
		deletedAt: null,
	});
	if (!doc) throw new FormSubmissionNotFoundError();

	doc.deletedAt = new Date();
	await doc.save();
	return cleanMongoFields(doc.toObject());
}
