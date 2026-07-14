import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import FormModel from '../infrastructure/FormModel';

export async function restoreForm(id: string) {
	const doc = await FormModel.findOne({ id, deletedAt: { $ne: null } }).lean();
	if (!doc) AppError.notFound('FORM_NOT_FOUND', 'Form not found in trash');

	await FormModel.findOneAndUpdate(
		{ id, deletedAt: { $ne: null } },
		{ $unset: { deletedAt: '' } },
	);
	return cleanMongoFields({ ...doc, deletedAt: undefined });
}
