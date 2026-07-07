import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { PortfolioNotFoundError } from '../domain/errors/PortfolioErrors';
import PortfolioModel from '../infrastructure/PortfolioModel';

export async function getPortfolioById(id: string) {
	const portfolio = await PortfolioModel.findOne({ id, deletedAt: null }).lean();
	if (!portfolio) throw new PortfolioNotFoundError();
	return cleanMongoFields(portfolio);
}
