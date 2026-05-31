import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { ServiceNotFoundError } from '../domain/errors/ServiceErrors';
import ServiceModel from '../infrastructure/ServiceModel';

export async function deleteServiceLogical(id: string) {
	const service = await ServiceModel.findOne({ id, deletedAt: null });
	if (!service) throw new ServiceNotFoundError();

	service.deletedAt = new Date();
	await service.save();

	return cleanMongoFields(
		service.toObject({ versionKey: false, getters: true }),
	);
}
