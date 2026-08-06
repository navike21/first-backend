import LocationModel from '../infrastructure/LocationModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { LocationNotFoundError } from '../domain/errors/InventoryErrors';

export async function deleteLocationLogical(id: string) {
	const doc = await LocationModel.findOne({ id, deletedAt: null });
	if (!doc) throw new LocationNotFoundError();

	doc.deletedAt = new Date();
	await doc.save();
	return cleanMongoFields(doc.toObject());
}
