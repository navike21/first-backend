import { randomUUID } from 'node:crypto';
import PageModel from '../infrastructure/PageModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { PageNotFoundError } from '../domain/errors/PageErrors';
import type { ReplaceSectionsInput } from '../schemas/page.schema';
import { recordPageRevision } from './pageRevisions';

/**
 * Full replace used by the visual builder: swaps the whole sections array in
 * one call and records a single page revision per save.
 */
export async function replaceSections(
	id: string,
	input: ReplaceSectionsInput,
	updatedBy: string | undefined,
) {
	const doc = await PageModel.findOne({ id, deletedAt: null });
	if (!doc) throw new PageNotFoundError();

	const sections = input.sections.map((section, index) => ({
		...section,
		sectionId: section.sectionId ?? randomUUID(),
		order: index,
	}));

	doc.sections = sections as never;
	doc.updatedBy = updatedBy;
	doc.markModified('sections');
	await doc.save();

	await recordPageRevision(id, doc.toObject(), updatedBy);

	return cleanMongoFields(doc.toObject());
}
