import { QueryFilter } from 'mongoose';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { metaInformation } from '@Helpers/metaInformation';
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
		deletedAt: null,
	};

	if (status) {
		query.status = status;
	}

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

	// An empty result is a valid 200 with an empty list (consistent with users
	// and audit-log) — never a 404; that would surface a spurious error toast.
	return {
		data: data.map(cleanMongoFields),
		meta: metaInformation({ page, limit, total }),
	};
}
