import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import ServiceModel from '../infrastructure/ServiceModel';

export async function deleteServicePhysical(id: string) {
	const deleted = await ServiceModel.findOneAndDelete({ id }).lean();
	if (!deleted) AppError.notFound('SERVICE_NOT_FOUND', 'Service not found');
	return cleanMongoFields(deleted);
}
