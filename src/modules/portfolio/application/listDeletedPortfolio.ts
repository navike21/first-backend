import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import PortfolioModel from '../infrastructure/PortfolioModel';

export async function listDeletedPortfolio({ page, limit }: { page: number; limit: number }) {
	const skip = (page - 1) * limit;
	const [data, total] = await Promise.all([
		PortfolioModel.find({ status: 'deleted' }).sort({ deletedAt: -1 }).skip(skip).limit(limit).lean(),
		PortfolioModel.countDocuments({ status: 'deleted' }),
	]);
	return {
		data: data.map(cleanMongoFields),
		meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
	};
}
