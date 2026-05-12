import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { ServiceNotFoundError } from '../domain/errors/ServiceErrors';
import ServiceModel from '../infrastructure/ServiceModel';

export async function deleteServiceLogical(id: string) {
	const service = await ServiceModel.findOne({ id, status: 'active' });
	if (!service) throw new ServiceNotFoundError();

	service.status = 'deleted';
	service.deletedAt = new Date();
	await service.save();

	return cleanMongoFields(service.toObject({ versionKey: false, getters: true }));
}
