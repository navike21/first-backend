import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { ServiceNotFoundError } from '../domain/errors/ServiceErrors';
import ServiceModel from '../infrastructure/ServiceModel';

export async function getServiceBySlug(slug: string) {
	const service = await ServiceModel.findOne({
		slug,
		isActive: true,
		status: 'active',
	}).lean();
	if (!service) throw new ServiceNotFoundError();
	return cleanMongoFields(service);
}
