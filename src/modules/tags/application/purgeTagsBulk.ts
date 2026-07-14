import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import TagModel from '../infrastructure/TagModel';

export async function purgeTagsBulk(ids: string[]) {
	const docs = await TagModel.find({
		id: { $in: ids },
		deletedAt: { $ne: null },
	}).lean();

	const processedIds = docs
		.map((d) => d.id)
		.filter((id): id is string => Boolean(id));
	const notFoundIds = ids.filter((id) => !processedIds.includes(id));

	if (processedIds.length === 0) {
		return { processed: [], processedIds: [], notFoundIds };
	}

	await TagModel.deleteMany({ id: { $in: processedIds } });

	return {
		processed: docs.map((d) => cleanMongoFields(d)),
		processedIds,
		notFoundIds,
	};
}
