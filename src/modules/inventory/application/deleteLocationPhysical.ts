import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import LocationModel from '../infrastructure/LocationModel';

export async function deleteLocationPhysical(id: string) {
	const doc = await LocationModel.findOne({
		id,
		deletedAt: { $ne: null },
	}).lean();
	if (!doc)
		AppError.notFound('LOCATION_NOT_FOUND', 'Location not found in trash');

	await LocationModel.deleteOne({ id });
	return cleanMongoFields(doc);
}
