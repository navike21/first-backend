import PageModel from '../infrastructure/PageModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { PageNotFoundError } from '../domain/errors/PageErrors';
import { CreateSectionInput } from '../schemas/page.schema';

export async function addSection(id: string, input: CreateSectionInput) {
	const doc = await PageModel.findOne({ id, deletedAt: null });
	if (!doc) throw new PageNotFoundError();

	const { randomUUID } = await import('node:crypto');
	doc.sections.push({ sectionId: randomUUID(), ...input } as never);
	doc.markModified('sections');
	await doc.save();
	return cleanMongoFields(doc.toObject());
}
