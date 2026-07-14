import FormModel from '../infrastructure/FormModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { FormNotFoundError } from '../domain/errors/FormErrors';

export async function deleteForm(id: string) {
	const doc = await FormModel.findOne({ id, deletedAt: null });
	if (!doc) throw new FormNotFoundError();

	doc.deletedAt = new Date();
	await doc.save();
	return cleanMongoFields(doc.toObject());
}
