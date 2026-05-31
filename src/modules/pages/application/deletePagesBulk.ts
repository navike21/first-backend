import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import PageModel from '../infrastructure/PageModel';

export async function deletePagesBulk(slugs: string[]) {
	const pages = await PageModel.find({ slug: { $in: slugs }, deletedAt: null }).lean();

	const processedSlugs = pages.map((p) => p.slug).filter((slug): slug is string => Boolean(slug));
	const notFoundIds = slugs.filter((slug) => !processedSlugs.includes(slug));

	if (processedSlugs.length === 0) {
		return { processed: [], processedIds: [], notFoundIds };
	}

	await PageModel.updateMany(
		{ slug: { $in: processedSlugs }, deletedAt: null },
		{ $set: { deletedAt: new Date() } },
	);

	return {
		processed: pages.map((p) => cleanMongoFields(p)),
		processedIds: processedSlugs,
		notFoundIds,
	};
}
