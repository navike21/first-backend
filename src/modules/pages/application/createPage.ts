import PageModel from '../infrastructure/PageModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { PageSlugConflictError } from '../domain/errors/PageErrors';
import { CreatePageInput } from '../schemas/page.schema';

export async function createPage(input: CreatePageInput) {
	const existing = await PageModel.findOne({
		slug: input.slug,
		status: { $ne: 'deleted' },
	});
	if (existing) throw new PageSlugConflictError();

	const doc = await PageModel.create(input);
	return cleanMongoFields(doc.toObject());
}
