import FormModel from '../infrastructure/FormModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { FormNotFoundError } from '../domain/errors/FormErrors';

export async function getFormById(id: string) {
	const doc = await FormModel.findOne({ id, deletedAt: null }).lean();
	if (!doc) throw new FormNotFoundError();
	return cleanMongoFields(doc);
}
