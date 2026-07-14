import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import FormModel from '../infrastructure/FormModel';
import FormSubmissionModel from '../infrastructure/FormSubmissionModel';

export async function purgeForm(id: string) {
	const doc = await FormModel.findOne({ id, deletedAt: { $ne: null } }).lean();
	if (!doc) AppError.notFound('FORM_NOT_FOUND', 'Form not found in trash');

	await FormModel.deleteOne({ id });
	await FormSubmissionModel.deleteMany({ formId: id });

	return cleanMongoFields(doc);
}
