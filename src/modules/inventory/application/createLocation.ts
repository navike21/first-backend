import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import LocationModel from '../infrastructure/LocationModel';
import type { CreateLocationInput } from '../schemas/location.schema';

export async function createLocation(input: CreateLocationInput) {
	const doc = await LocationModel.create(input);
	return cleanMongoFields(doc.toObject());
}
