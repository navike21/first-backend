import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { metaInformation } from '@Helpers/metaInformation';
import { AppError } from '@Shared/domain/AppError';
import ServiceModel from '@Modules/services/infrastructure/ServiceModel';
import PortfolioModel from '../infrastructure/PortfolioModel';

const SLUG_LANGS = ['en', 'es', 'de', 'fr', 'it', 'ja', 'ko', 'pt', 'ru', 'zh'] as const;

interface ListPortfolioByServiceParams {
	serviceSlug: string;
	page: number;
	limit: number;
}

export async function listPortfolioByService({
	serviceSlug,
	page,
	limit,
}: ListPortfolioByServiceParams) {
	const service = await ServiceModel.findOne({
		$or: SLUG_LANGS.map((l) => ({ [`slug.${l}`]: serviceSlug })),
		status: 'active',
	}).lean();
	if (!service) {
		AppError.notFound('SERVICE_NOT_FOUND', 'Service not found');
	}

	const skip = (page - 1) * limit;
	const query = { serviceIds: service.id, status: 'published' };

	const [data, total] = await Promise.all([
		PortfolioModel.find(query)
			.sort({ featured: -1, order: 1, createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.select({ description: 0 })
			.lean(),
		PortfolioModel.countDocuments(query),
	]);

	return {
		data: data.map(cleanMongoFields),
		meta: metaInformation({ page, limit, total }),
	};
}
