import PageModel from '../infrastructure/PageModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import {
	PageNotFoundError,
	PageSlugConflictError,
} from '../domain/errors/PageErrors';
import { UpdatePageInput } from '../schemas/page.schema';

export async function updatePage(slug: string, input: UpdatePageInput) {
	const doc = await PageModel.findOne({ slug, status: { $ne: 'deleted' } });
	if (!doc) throw new PageNotFoundError();

	if (input.slug && input.slug !== slug) {
		const conflict = await PageModel.findOne({
			slug: input.slug,
			status: { $ne: 'deleted' },
		});
		if (conflict) throw new PageSlugConflictError();
	}

	Object.assign(doc, input);
	await doc.save();
	return cleanMongoFields(doc.toObject());
}
