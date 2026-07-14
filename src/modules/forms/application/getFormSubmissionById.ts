import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import FormSubmissionModel from '../infrastructure/FormSubmissionModel';
import { FormSubmissionNotFoundError } from '../domain/errors/FormErrors';

export async function getFormSubmissionById(formId: string, id: string) {
	const doc = await FormSubmissionModel.findOne({
		id,
		formId,
		deletedAt: null,
	}).lean();
	if (!doc) throw new FormSubmissionNotFoundError();
	return cleanMongoFields(doc);
}
