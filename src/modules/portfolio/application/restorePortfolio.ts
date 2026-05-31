import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import PortfolioModel from '../infrastructure/PortfolioModel';

export async function restorePortfolio(id: string) {
	const item = await PortfolioModel.findOne({ id, deletedAt: { $ne: null } }).lean();
	if (!item) AppError.notFound('PORTFOLIO_NOT_FOUND', 'Portfolio item not found in trash');

	await PortfolioModel.findOneAndUpdate(
		{ id, deletedAt: { $ne: null } },
		{ $unset: { deletedAt: '' } },
	);
	return cleanMongoFields({ ...item, deletedAt: undefined });
}
