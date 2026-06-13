import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import { deleteEntityFiles } from '@Modules/storage';
import PortfolioModel from '../infrastructure/PortfolioModel';
import { PORTFOLIO_ENTITY_TYPE } from '../constants/paths';

export async function deletePortfolioPhysical(id: string) {
	const portfolio = await PortfolioModel.findOne({ id, deletedAt: { $ne: null } }).lean();
	if (!portfolio) AppError.notFound('PORTFOLIO_NOT_FOUND', 'Portfolio item not found in trash');

	await PortfolioModel.deleteOne({ id });
	await deleteEntityFiles(PORTFOLIO_ENTITY_TYPE, id).catch(() => {});
	return cleanMongoFields(portfolio);
}
