import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import PortfolioModel from '../infrastructure/PortfolioModel';

export async function deletePortfolioBulk(ids: string[]) {
	const items = await PortfolioModel.find({ id: { $in: ids }, deletedAt: null }).lean();

	const processedIds = items.map((i) => i.id).filter((id): id is string => Boolean(id));
	const notFoundIds = ids.filter((id) => !processedIds.includes(id));

	if (processedIds.length === 0) {
		return { processed: [], processedIds: [], notFoundIds };
	}

	await PortfolioModel.updateMany(
		{ id: { $in: processedIds }, deletedAt: null },
		{ $set: { deletedAt: new Date() } },
	);

	return {
		processed: items.map((i) => cleanMongoFields(i)),
		processedIds,
		notFoundIds,
	};
}
