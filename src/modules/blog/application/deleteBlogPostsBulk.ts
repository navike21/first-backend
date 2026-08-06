import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import BlogModel from '../infrastructure/BlogModel';

export async function deleteBlogPostsBulk(ids: string[]) {
	const items = await BlogModel.find({
		id: { $in: ids },
		deletedAt: null,
	}).lean();

	const processedIds = items
		.map((i) => i.id)
		.filter((id): id is string => Boolean(id));
	const notFoundIds = ids.filter((id) => !processedIds.includes(id));

	if (processedIds.length === 0) {
		return { processed: [], processedIds: [], notFoundIds };
	}

	await BlogModel.updateMany(
		{ id: { $in: processedIds }, deletedAt: null },
		{ $set: { deletedAt: new Date() } },
	);

	return {
		processed: items.map((i) => cleanMongoFields(i)),
		processedIds,
		notFoundIds,
	};
}
