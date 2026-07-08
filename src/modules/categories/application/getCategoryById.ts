import CategoryModel from '../infrastructure/CategoryModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { CategoryNotFoundError } from '../domain/errors/CategoryErrors';

export async function getCategoryById(id: string) {
	const doc = await CategoryModel.findOne({ id, deletedAt: null }).lean();
	if (!doc) throw new CategoryNotFoundError();
	return cleanMongoFields(doc);
}
