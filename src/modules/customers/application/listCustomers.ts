import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { metaInformation } from '@Helpers/metaInformation';
import { escapeRegex } from '@Helpers/escapeRegex';
import CustomerModel from '../infrastructure/CustomerModel';

interface ListCustomersParams {
	page: number;
	limit: number;
	status?: string;
	search?: string;
}

export async function listCustomers({
	page,
	limit,
	status,
	search,
}: ListCustomersParams) {
	const skip = (page - 1) * limit;

	const query: Record<string, unknown> = { deletedAt: null };
	if (status) query.status = status;
	if (search) {
		const pattern = escapeRegex(search);
		query.$or = [
			{ firstName: { $regex: pattern, $options: 'i' } },
			{ lastName: { $regex: pattern, $options: 'i' } },
			{ email: { $regex: pattern, $options: 'i' } },
		];
	}

	const [data, total] = await Promise.all([
		CustomerModel.find(query).skip(skip).limit(limit).lean(),
		CustomerModel.countDocuments(query),
	]);

	// An empty result is a valid 200 with an empty list — never a 404.
	return {
		data: data.map(cleanMongoFields),
		meta: metaInformation({ page, limit, total }),
	};
}
