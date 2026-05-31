import PageModel from '../infrastructure/PageModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { PageNotFoundError } from '../domain/errors/PageErrors';

export async function deletePage(slug: string) {
	const doc = await PageModel.findOne({ slug, deletedAt: null });
	if (!doc) throw new PageNotFoundError();

	doc.deletedAt = new Date();
	await doc.save();
	return cleanMongoFields(doc.toObject());
}
