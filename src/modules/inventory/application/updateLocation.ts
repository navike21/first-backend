import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import LocationModel from '../infrastructure/LocationModel';
import { LocationNotFoundError } from '../domain/errors/InventoryErrors';
import type { UpdateLocationInput } from '../schemas/location.schema';

export async function updateLocation(id: string, input: UpdateLocationInput) {
	const doc = await LocationModel.findOne({ id, deletedAt: null });
	if (!doc) throw new LocationNotFoundError();

	Object.assign(doc, input);
	await doc.save();
	return cleanMongoFields(doc.toObject());
}
