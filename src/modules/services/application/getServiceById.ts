import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { ServiceNotFoundError } from '../domain/errors/ServiceErrors';
import ServiceModel from '../infrastructure/ServiceModel';

export async function getServiceById(id: string) {
	const service = await ServiceModel.findOne({ id }).lean();
	if (!service) throw new ServiceNotFoundError();
	return cleanMongoFields(service);
}
