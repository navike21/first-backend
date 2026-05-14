import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { metaInformation } from '@Helpers/metaInformation';
import { AppError } from '@Shared/domain/AppError';
import PortfolioModel from '../infrastructure/PortfolioModel';

interface ListPortfolioPublicParams {
	page: number;
	limit: number;
	featured?: boolean;
}

export async function listPortfolioPublic({
	page,
	limit,
	featured,
}: ListPortfolioPublicParams) {
	const skip = (page - 1) * limit;
	const query: Record<string, unknown> = { status: 'published' };
	if (featured !== undefined) query.featured = featured;

	const [data, total] = await Promise.all([
		PortfolioModel.find(query)
			.sort({ featured: -1, order: 1, createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.select({ description: 0 })
			.lean(),
		PortfolioModel.countDocuments(query),
	]);

	if (data.length === 0) {
		AppError.notFound('PORTFOLIO_LIST_EMPTY', 'Portfolio list empty');
	}

	return {
		data: data.map(cleanMongoFields),
		meta: metaInformation({ page, limit, total }),
	};
}
