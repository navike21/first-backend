import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import ServiceModel from '../infrastructure/ServiceModel';

export async function deleteServicePhysical(id: string) {
	const service = await ServiceModel.findOne({ id, deletedAt: { $ne: null } }).lean();
	if (!service) AppError.notFound('SERVICE_NOT_FOUND', 'Service not found in trash');

	await ServiceModel.deleteOne({ id });
	return cleanMongoFields(service);
}
