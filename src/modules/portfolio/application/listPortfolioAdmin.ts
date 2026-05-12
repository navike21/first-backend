import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { metaInformation } from '@Helpers/metaInformation';
import setThrowError from '@Helpers/setThrowError';
import PortfolioModel from '../infrastructure/PortfolioModel';
import type { PortfolioStatus } from '../constants/portfolioStatus';

interface ListPortfolioAdminParams {
	page: number;
	limit: number;
	status?: PortfolioStatus;
}

export async function listPortfolioAdmin({
	page,
	limit,
	status,
}: ListPortfolioAdminParams) {
	const skip = (page - 1) * limit;
	const query: Record<string, unknown> = { status: { $ne: 'deleted' } };
	if (status) query.status = status;

	const [data, total] = await Promise.all([
		PortfolioModel.find(query)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.lean(),
		PortfolioModel.countDocuments(query),
	]);

	if (data.length === 0) {
		setThrowError({
			statusCode: 404,
			code: 'PORTFOLIO_LIST_EMPTY',
			message: 'Portfolio list empty',
		});
	}

	return {
		data: data.map(cleanMongoFields),
		meta: metaInformation({ page, limit, total }),
	};
}
