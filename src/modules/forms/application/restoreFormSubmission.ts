import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import FormSubmissionModel from '../infrastructure/FormSubmissionModel';

export async function restoreFormSubmission(formId: string, id: string) {
	const doc = await FormSubmissionModel.findOne({
		id,
		formId,
		deletedAt: { $ne: null },
	}).lean();
	if (!doc)
		AppError.notFound(
			'FORM_SUBMISSION_NOT_FOUND',
			'Submission not found in trash',
		);

	await FormSubmissionModel.findOneAndUpdate(
		{ id, formId, deletedAt: { $ne: null } },
		{ $unset: { deletedAt: '' } },
	);
	return cleanMongoFields({ ...doc, deletedAt: undefined });
}
