import PageModel from '../infrastructure/PageModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { PageNotFoundError } from '../domain/errors/PageErrors';

export async function reorderSections(slug: string, order: string[]) {
	const doc = await PageModel.findOne({ slug, deletedAt: null });
	if (!doc) throw new PageNotFoundError();

	const sectionMap = new Map(
		doc.sections.map((s: { sectionId: string }) => [s.sectionId, s]),
	);

	const reordered = order
		.filter((id) => sectionMap.has(id))
		.map((id, idx) => {
			const section = sectionMap.get(id) as Record<string, unknown>;
			section.order = idx;
			return section;
		});

	const remaining = doc.sections.filter(
		(s: { sectionId: string }) => !order.includes(s.sectionId),
	);

	doc.sections = [...reordered, ...remaining] as never;
	doc.markModified('sections');
	await doc.save();
	return cleanMongoFields(doc.toObject());
}
