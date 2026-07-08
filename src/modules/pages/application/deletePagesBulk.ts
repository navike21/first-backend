import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import PageModel from '../infrastructure/PageModel';

export async function deletePagesBulk(ids: string[]) {
	const pages = await PageModel.find({ id: { $in: ids }, deletedAt: null }).lean();

	const processedIds = pages.map((p) => p.id).filter((id): id is string => Boolean(id));
	const notFoundIds = ids.filter((id) => !processedIds.includes(id));

	if (processedIds.length === 0) {
		return { processed: [], processedIds: [], notFoundIds };
	}

	await PageModel.updateMany({ id: { $in: processedIds }, deletedAt: null }, { $set: { deletedAt: new Date() } });

	return {
		processed: pages.map((p) => cleanMongoFields(p)),
		processedIds,
		notFoundIds,
	};
}
