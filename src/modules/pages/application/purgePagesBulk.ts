import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { deleteEntityFiles } from '@Modules/storage';
import PageModel from '../infrastructure/PageModel';
import PageRevisionModel from '../infrastructure/PageRevisionModel';
import { PAGE_ENTITY_TYPE } from '../constants/paths';

export async function purgePagesBulk(ids: string[]) {
	const pages = await PageModel.find({
		id: { $in: ids },
		deletedAt: { $ne: null },
	}).lean();
	const foundIds = pages
		.map((p) => p.id)
		.filter((id): id is string => Boolean(id));

	const childCounts = await PageModel.find({
		parentId: { $in: foundIds },
		deletedAt: null,
	})
		.select('parentId')
		.lean();
	const idsWithChildren = new Set(
		childCounts.map((c) => (c as unknown as { parentId: string }).parentId),
	);

	const purgeableIds = foundIds.filter((id) => !idsWithChildren.has(id));
	const blockedIds = foundIds.filter((id) => idsWithChildren.has(id));
	const notFoundIds = ids.filter((id) => !foundIds.includes(id));

	if (purgeableIds.length === 0) {
		return {
			processed: [],
			processedIds: [],
			notFoundIds: [...notFoundIds, ...blockedIds],
			blockedIds,
		};
	}

	await PageModel.deleteMany({ id: { $in: purgeableIds } });
	await PageRevisionModel.deleteMany({ pageId: { $in: purgeableIds } });
	await Promise.all(
		purgeableIds.map((id) =>
			deleteEntityFiles(PAGE_ENTITY_TYPE, id).catch(() => {}),
		),
	);

	return {
		processed: pages
			.filter((p) => purgeableIds.includes(p.id))
			.map((p) => cleanMongoFields(p)),
		processedIds: purgeableIds,
		notFoundIds: [...notFoundIds, ...blockedIds],
		blockedIds,
	};
}
