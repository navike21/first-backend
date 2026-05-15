import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { generateSlug } from '@Helpers/generateSlug';
import { PortfolioSlugConflictError } from '../domain/errors/PortfolioErrors';
import PortfolioModel from '../infrastructure/PortfolioModel';
import type { CreatePortfolioInput } from '../schemas/portfolio.schema';

export async function createPortfolio(input: CreatePortfolioInput) {
	const slug = input.slug ?? generateSlug(input.name.en);

	const existing = await PortfolioModel.findOne({ slug });
	if (existing) throw new PortfolioSlugConflictError();

	const portfolio = await PortfolioModel.create({ ...input, slug });
	return cleanMongoFields(
		portfolio.toObject({ versionKey: false, getters: true }),
	);
}
