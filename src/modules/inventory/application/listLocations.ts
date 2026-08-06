import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { metaInformation } from '@Helpers/metaInformation';
import { escapeRegex } from '@Helpers/escapeRegex';
import LocationModel from '../infrastructure/LocationModel';

interface ListLocationsParams {
	page: number;
	limit: number;
	search?: string;
	isActive?: boolean;
}

export async function listLocations({
	page,
	limit,
	search,
	isActive,
}: ListLocationsParams) {
	const skip = (page - 1) * limit;

	const query: Record<string, unknown> = { deletedAt: null };
	if (isActive !== undefined) query.isActive = isActive;
	if (search) {
		query.name = { $regex: escapeRegex(search), $options: 'i' };
	}

	const [data, total] = await Promise.all([
		LocationModel.find(query).skip(skip).limit(limit).lean(),
		LocationModel.countDocuments(query),
	]);

	return {
		data: data.map(cleanMongoFields),
		meta: metaInformation({ page, limit, total }),
	};
}
