import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import PortfolioModel from '../infrastructure/PortfolioModel';

export async function deletePortfolioPhysical(id: string) {
	const deleted = await PortfolioModel.findOneAndDelete({ id }).lean();
	if (!deleted) AppError.notFound('PORTFOLIO_NOT_FOUND', 'Portfolio item not found');
	return cleanMongoFields(deleted);
}
