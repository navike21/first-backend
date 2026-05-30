import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import ServiceModel from '../infrastructure/ServiceModel';

export async function listDeletedServices({ page, limit }: { page: number; limit: number }) {
	const skip = (page - 1) * limit;
	const [data, total] = await Promise.all([
		ServiceModel.find({ status: 'deleted' }).sort({ deletedAt: -1 }).skip(skip).limit(limit).lean(),
		ServiceModel.countDocuments({ status: 'deleted' }),
	]);
	return {
		data: data.map(cleanMongoFields),
		meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
	};
}
