import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import {
	PortfolioNotFoundError,
	PortfolioSlugConflictError,
} from '../domain/errors/PortfolioErrors';
import PortfolioModel from '../infrastructure/PortfolioModel';
import type { UpdatePortfolioInput } from '../schemas/portfolio.schema';

export async function updatePortfolio(id: string, input: UpdatePortfolioInput) {
	const portfolio = await PortfolioModel.findOne({
		id,
		deletedAt: null,
	});
	if (!portfolio) throw new PortfolioNotFoundError();

	if (input.slug) {
		const conflict = await PortfolioModel.findOne({
			slug: input.slug,
			id: { $ne: id },
		});
		if (conflict) throw new PortfolioSlugConflictError();
	}

	Object.assign(portfolio, input);
	await portfolio.save();
	return cleanMongoFields(
		portfolio.toObject({ versionKey: false, getters: true }),
	);
}
