import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { deleteEntityFiles } from '@Modules/storage';
import BlogModel from '../infrastructure/BlogModel';
import { BLOG_ENTITY_TYPE } from '../constants/paths';

interface BulkResult {
	processed: unknown[];
	processedIds: string[];
	notFoundIds: string[];
}

async function findAndPartition(ids: string[], filter: Record<string, unknown>) {
	const items = await BlogModel.find({ id: { $in: ids }, ...filter }).lean();
	const processedIds = items
		.map((i) => i.id)
		.filter((id): id is string => Boolean(id));
	const notFoundIds = ids.filter((id) => !processedIds.includes(id));
	return { items, processedIds, notFoundIds };
}

export async function deleteBlogPostsBulk(ids: string[]): Promise<BulkResult> {
	const { items, processedIds, notFoundIds } = await findAndPartition(ids, {
		deletedAt: null,
	});
	if (processedIds.length === 0) return { processed: [], processedIds: [], notFoundIds };

	await BlogModel.updateMany(
		{ id: { $in: processedIds }, deletedAt: null },
		{ $set: { deletedAt: new Date() } },
	);

	return { processed: items.map((i) => cleanMongoFields(i)), processedIds, notFoundIds };
}

export async function restoreBlogPostsBulk(ids: string[]): Promise<BulkResult> {
	const { items, processedIds, notFoundIds } = await findAndPartition(ids, {
		deletedAt: { $ne: null },
	});
	if (processedIds.length === 0) return { processed: [], processedIds: [], notFoundIds };

	await BlogModel.updateMany(
		{ id: { $in: processedIds }, deletedAt: { $ne: null } },
		{ $unset: { deletedAt: '' } },
	);

	return {
		processed: items.map((i) => cleanMongoFields({ ...i, deletedAt: undefined })),
		processedIds,
		notFoundIds,
	};
}

export async function purgeBlogPostsBulk(ids: string[]): Promise<BulkResult> {
	const { items, processedIds, notFoundIds } = await findAndPartition(ids, {
		deletedAt: { $ne: null },
	});
	if (processedIds.length === 0) return { processed: [], processedIds: [], notFoundIds };

	await BlogModel.deleteMany({ id: { $in: processedIds } });
	await Promise.all(
		processedIds.map((id) =>
			deleteEntityFiles(BLOG_ENTITY_TYPE, id).catch(() => {}),
		),
	);

	return { processed: items.map((i) => cleanMongoFields(i)), processedIds, notFoundIds };
}
