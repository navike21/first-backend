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
	const items = (await BlogModel.find({ id: { $in: ids }, ...filter }).lean()) as unknown as Record<
		string,
		unknown
	>[];
	const processedIds = items
		.map((i) => i.id)
		.filter((id): id is string => Boolean(id));
	const notFoundIds = ids.filter((id) => !processedIds.includes(id));
	return { items, processedIds, notFoundIds };
}

/** Shared shape for delete/restore/purge-bulk: find+partition ids, bail out
 * early when nothing matched, otherwise run the caller's mutation and map
 * the matched docs through `mapItem` for the response. */
async function runBulkOperation(
	ids: string[],
	filter: Record<string, unknown>,
	mutate: (processedIds: string[]) => Promise<void>,
	mapItem: (item: Record<string, unknown>) => unknown = (i) => cleanMongoFields(i),
): Promise<BulkResult> {
	const { items, processedIds, notFoundIds } = await findAndPartition(ids, filter);
	if (processedIds.length === 0) return { processed: [], processedIds: [], notFoundIds };

	await mutate(processedIds);

	return { processed: items.map(mapItem), processedIds, notFoundIds };
}

export function deleteBlogPostsBulk(ids: string[]): Promise<BulkResult> {
	return runBulkOperation(ids, { deletedAt: null }, async (processedIds) => {
		await BlogModel.updateMany(
			{ id: { $in: processedIds }, deletedAt: null },
			{ $set: { deletedAt: new Date() } },
		);
	});
}

export function restoreBlogPostsBulk(ids: string[]): Promise<BulkResult> {
	return runBulkOperation(
		ids,
		{ deletedAt: { $ne: null } },
		async (processedIds) => {
			await BlogModel.updateMany(
				{ id: { $in: processedIds }, deletedAt: { $ne: null } },
				{ $unset: { deletedAt: '' } },
			);
		},
		(i) => cleanMongoFields({ ...i, deletedAt: undefined }),
	);
}

export function purgeBlogPostsBulk(ids: string[]): Promise<BulkResult> {
	return runBulkOperation(ids, { deletedAt: { $ne: null } }, async (processedIds) => {
		await BlogModel.deleteMany({ id: { $in: processedIds } });
		await Promise.all(
			processedIds.map((id) =>
				deleteEntityFiles(BLOG_ENTITY_TYPE, id).catch(() => {}),
			),
		);
	});
}
