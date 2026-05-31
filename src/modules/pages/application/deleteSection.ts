import PageModel from '../infrastructure/PageModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import {
	PageNotFoundError,
	PageSectionNotFoundError,
} from '../domain/errors/PageErrors';

export async function deleteSection(slug: string, sectionId: string) {
	const doc = await PageModel.findOne({ slug, deletedAt: null });
	if (!doc) throw new PageNotFoundError();

	const idx = doc.sections.findIndex(
		(s: { sectionId: string }) => s.sectionId === sectionId,
	);
	if (idx === -1) throw new PageSectionNotFoundError();

	doc.sections.splice(idx, 1);
	doc.markModified('sections');
	await doc.save();
	return cleanMongoFields(doc.toObject());
}
