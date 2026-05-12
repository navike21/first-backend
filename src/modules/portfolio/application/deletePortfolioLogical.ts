import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { PortfolioNotFoundError } from '../domain/errors/PortfolioErrors';
import PortfolioModel from '../infrastructure/PortfolioModel';

export async function deletePortfolioLogical(id: string) {
	const portfolio = await PortfolioModel.findOne({
		id,
		status: { $ne: 'deleted' },
	});
	if (!portfolio) throw new PortfolioNotFoundError();

	portfolio.status = 'deleted';
	portfolio.deletedAt = new Date();
	await portfolio.save();

	return cleanMongoFields(
		portfolio.toObject({ versionKey: false, getters: true }),
	);
}
