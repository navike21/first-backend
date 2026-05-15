import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { metaInformation } from '@Helpers/metaInformation';
import { AppError } from '@Shared/domain/AppError';
import ServiceModel from '../infrastructure/ServiceModel';

interface ListServicesPublicParams {
	page: number;
	limit: number;
}

export async function listServicesPublic({
	page,
	limit,
}: ListServicesPublicParams) {
	const skip = (page - 1) * limit;
	const query = { isActive: true, status: 'active' };

	const [data, total] = await Promise.all([
		ServiceModel.find(query)
			.sort({ order: 1, createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.lean(),
		ServiceModel.countDocuments(query),
	]);

	if (data.length === 0) {
		AppError.notFound('SERVICE_LIST_EMPTY', 'Service list empty');
	}

	return {
		data: data.map(cleanMongoFields),
		meta: metaInformation({ page, limit, total }),
	};
}
