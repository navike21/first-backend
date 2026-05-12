import PageModel from '../infrastructure/PageModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { PageNotFoundError } from '../domain/errors/PageErrors';

export async function getPageBySlug(slug: string, adminView = false) {
	const filter = adminView
		? { slug, status: { $ne: 'deleted' } }
		: { slug, status: 'published', isPublished: true };

	const doc = await PageModel.findOne(filter).lean();
	if (!doc) throw new PageNotFoundError();
	return cleanMongoFields(doc);
}
