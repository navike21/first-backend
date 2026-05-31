import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import PortfolioModel from '../infrastructure/PortfolioModel';

export async function restorePortfolioBulk(ids: string[]) {
	const items = await PortfolioModel.find({ id: { $in: ids }, deletedAt: { $ne: null } }).lean();

	const processedIds = items.map((i) => i.id).filter((id): id is string => Boolean(id));
	const notFoundIds = ids.filter((id) => !processedIds.includes(id));

	if (processedIds.length === 0) {
		return { processed: [], processedIds: [], notFoundIds };
	}

	await PortfolioModel.updateMany(
		{ id: { $in: processedIds }, deletedAt: { $ne: null } },
		{ $unset: { deletedAt: '' } },
	);

	return {
		processed: items.map((i) => cleanMongoFields({ ...i, deletedAt: undefined })),
		processedIds,
		notFoundIds,
	};
}
