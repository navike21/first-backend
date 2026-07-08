import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import PageModel from '../infrastructure/PageModel';

export async function restorePagesBulk(ids: string[]) {
	const pages = await PageModel.find({ id: { $in: ids }, deletedAt: { $ne: null } }).lean();

	const processedIds = pages.map((p) => p.id).filter((id): id is string => Boolean(id));
	const notFoundIds = ids.filter((id) => !processedIds.includes(id));

	if (processedIds.length === 0) {
		return { processed: [], processedIds: [], notFoundIds };
	}

	await PageModel.updateMany({ id: { $in: processedIds }, deletedAt: { $ne: null } }, { $unset: { deletedAt: '' } });

	return {
		processed: pages.map((p) => cleanMongoFields({ ...p, deletedAt: undefined })),
		processedIds,
		notFoundIds,
	};
}
