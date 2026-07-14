import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { metaInformation } from '@Helpers/metaInformation';
import ClientModel from '../infrastructure/ClientModel';

export async function listDeletedClients({
	page,
	limit,
}: {
	page: number;
	limit: number;
}) {
	const skip = (page - 1) * limit;
	const [data, total] = await Promise.all([
		ClientModel.find({ deletedAt: { $ne: null } })
			.sort({ deletedAt: -1 })
			.skip(skip)
			.limit(limit)
			.select({
				id: 1,
				businessName: 1,
				clientType: 1,
				country: 1,
				logoUrl: 1,
				status: 1,
				deletedAt: 1,
			})
			.lean(),
		ClientModel.countDocuments({ deletedAt: { $ne: null } }),
	]);
	return {
		data: data.map(cleanMongoFields),
		meta: metaInformation({ page, limit, total }),
	};
}
