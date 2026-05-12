import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { metaInformation } from '@Helpers/metaInformation';
import setThrowError from '@Helpers/setThrowError';
import ServiceModel from '@Modules/services/infrastructure/ServiceModel';
import PortfolioModel from '../infrastructure/PortfolioModel';

interface ListPortfolioByServiceParams {
	serviceSlug: string;
	page: number;
	limit: number;
}

export async function listPortfolioByService({ serviceSlug, page, limit }: ListPortfolioByServiceParams) {
	const service = await ServiceModel.findOne({ slug: serviceSlug, status: 'active' }).lean();
	if (!service) {
		setThrowError({
			statusCode: 404,
			code: 'SERVICE_NOT_FOUND',
			message: 'Service not found',
		});
	}

	const skip = (page - 1) * limit;
	const query = { serviceIds: service!.id, status: 'published' };

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
