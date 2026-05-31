import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import PageModel from '../infrastructure/PageModel';

export async function purgePagesBulk(slugs: string[]) {
	const pages = await PageModel.find({ slug: { $in: slugs }, deletedAt: { $ne: null } }).lean();

	const processedSlugs = pages.map((p) => p.slug).filter((slug): slug is string => Boolean(slug));
	const notFoundIds = slugs.filter((slug) => !processedSlugs.includes(slug));

	if (processedSlugs.length === 0) {
		return { processed: [], processedIds: [], notFoundIds };
	}

	await PageModel.deleteMany({ slug: { $in: processedSlugs } });

	return {
		processed: pages.map((p) => cleanMongoFields(p)),
		processedIds: processedSlugs,
		notFoundIds,
	};
}
