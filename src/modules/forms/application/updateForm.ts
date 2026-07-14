import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import FormModel from '../infrastructure/FormModel';
import { FormNotFoundError } from '../domain/errors/FormErrors';
import { assignFieldIds } from './assignFieldIds';
import type { UpdateFormInput } from '../schemas/form.schema';

export async function updateForm(id: string, input: UpdateFormInput) {
	const doc = await FormModel.findOne({ id, deletedAt: null });
	if (!doc) throw new FormNotFoundError();

	const { fields, ...rest } = input;
	Object.assign(doc, rest);
	if (fields) doc.set('fields', assignFieldIds(fields));

	await doc.save();
	return cleanMongoFields(doc.toObject());
}
