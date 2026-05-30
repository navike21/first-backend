import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import PortfolioModel from '../infrastructure/PortfolioModel';

export async function restorePortfolio(id: string) {
	const item = await PortfolioModel.findOne({ id, status: 'deleted' }).lean();
	if (!item) AppError.notFound('PORTFOLIO_NOT_FOUND', 'Portfolio item not found in trash');

	await PortfolioModel.findOneAndUpdate(
		{ id, status: 'deleted' },
		{ $set: { status: 'draft' }, $unset: { deletedAt: '' } },
	);
	return cleanMongoFields({ ...item, status: 'draft', deletedAt: undefined });
}
