import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import FormModel from '../infrastructure/FormModel';
import { assignFieldIds } from './assignFieldIds';
import type { CreateFormInput } from '../schemas/form.schema';

export async function createForm(input: CreateFormInput) {
	const doc = await FormModel.create({
		...input,
		fields: assignFieldIds(input.fields),
	});
	return cleanMongoFields(doc.toObject());
}
