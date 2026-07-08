import PageModel from '../infrastructure/PageModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import {
	PageNotFoundError,
	PageSectionNotFoundError,
} from '../domain/errors/PageErrors';
import { UpdateSectionInput } from '../schemas/page.schema';

export async function updateSection(
	id: string,
	sectionId: string,
	input: UpdateSectionInput,
) {
	const doc = await PageModel.findOne({ id, deletedAt: null });
	if (!doc) throw new PageNotFoundError();

	const section = doc.sections.find(
		(s: { sectionId: string }) => s.sectionId === sectionId,
	);
	if (!section) throw new PageSectionNotFoundError();

	Object.assign(section, input);
	doc.markModified('sections');
	await doc.save();
	return cleanMongoFields(doc.toObject());
}
