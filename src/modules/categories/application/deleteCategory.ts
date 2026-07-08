import CategoryModel from '../infrastructure/CategoryModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { CategoryNotFoundError } from '../domain/errors/CategoryErrors';

export async function deleteCategory(id: string) {
	const doc = await CategoryModel.findOne({ id, deletedAt: null });
	if (!doc) throw new CategoryNotFoundError();

	doc.deletedAt = new Date();
	await doc.save();
	return cleanMongoFields(doc.toObject());
}
