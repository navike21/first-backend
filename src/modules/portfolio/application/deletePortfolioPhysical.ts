import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import PortfolioModel from '../infrastructure/PortfolioModel';

export async function deletePortfolioPhysical(id: string) {
	const portfolio = await PortfolioModel.findOne({ id, deletedAt: { $ne: null } }).lean();
	if (!portfolio) AppError.notFound('PORTFOLIO_NOT_FOUND', 'Portfolio item not found in trash');

	await PortfolioModel.deleteOne({ id });
	return cleanMongoFields(portfolio);
}
