import LocationModel from '../infrastructure/LocationModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { LocationNotFoundError } from '../domain/errors/InventoryErrors';

export async function getLocationById(id: string) {
	const doc = await LocationModel.findOne({ id, deletedAt: null }).lean();
	if (!doc) throw new LocationNotFoundError();
	return cleanMongoFields(doc);
}
