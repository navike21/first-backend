import { QueryFilter } from 'mongoose';
import { ACTIVE, DELETED } from '@Constants/statusRegister';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { metaInformation } from '@Helpers/metaInformation';
import { AppError } from '@Shared/domain/AppError';
import ClientModel from '../infrastructure/ClientModel';
import type { ClientDocument } from '../infrastructure/ClientModel';

interface ListClientsParams {
	page: number;
	limit: number;
	status?: string;
	search?: string;
}

export async function listClients({
	page,
	limit,
	status,
	search,
}: ListClientsParams) {
	const skip = (page - 1) * limit;

	const query: QueryFilter<ClientDocument> = {
		status: status && status !== DELETED ? status : ACTIVE,
	};

	if (search) {
		query.businessName = { $regex: search, $options: 'i' };
	}

	const [data, total] = await Promise.all([
		ClientModel.find(query)
			.skip(skip)
			.limit(limit)
			.select({
				id: 1,
				businessName: 1,
				clientType: 1,
				country: 1,
				logoUrl: 1,
				website: 1,
				industry: 1,
				status: 1,
			})
			.lean(),
		ClientModel.countDocuments(query),
	]);

	if (data.length === 0) {
		AppError.notFound('CLIENT_LIST_EMPTY', 'Client list empty');
	}

	return {
		data: data.map(cleanMongoFields),
		meta: metaInformation({ page, limit, total }),
	};
}
