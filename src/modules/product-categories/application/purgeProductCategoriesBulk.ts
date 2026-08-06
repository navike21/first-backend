import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import ProductCategoryModel from '../infrastructure/ProductCategoryModel';

export async function purgeProductCategoriesBulk(ids: string[]) {
	const docs = await ProductCategoryModel.find({
		id: { $in: ids },
		deletedAt: { $ne: null },
	}).lean();
	const foundIds = docs
		.map((d) => d.id)
		.filter((id): id is string => Boolean(id));

	const childCounts = await ProductCategoryModel.find({
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

	await ProductCategoryModel.deleteMany({ id: { $in: purgeableIds } });

	return {
		processed: docs
			.filter((d) => purgeableIds.includes(d.id))
			.map((d) => cleanMongoFields(d)),
		processedIds: purgeableIds,
		notFoundIds: [...notFoundIds, ...blockedIds],
		blockedIds,
	};
}
