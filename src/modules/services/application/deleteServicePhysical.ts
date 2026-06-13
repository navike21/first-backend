import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import { deleteEntityFiles } from '@Modules/storage';
import ServiceModel from '../infrastructure/ServiceModel';
import { SERVICE_ENTITY_TYPE } from '../constants/paths';

export async function deleteServicePhysical(id: string) {
	const service = await ServiceModel.findOne({ id, deletedAt: { $ne: null } }).lean();
	if (!service) AppError.notFound('SERVICE_NOT_FOUND', 'Service not found in trash');

	await ServiceModel.deleteOne({ id });
	await deleteEntityFiles(SERVICE_ENTITY_TYPE, id).catch(() => {});
	return cleanMongoFields(service);
}
