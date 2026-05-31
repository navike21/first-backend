import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import ServiceModel from '../infrastructure/ServiceModel';

export async function restoreService(id: string) {
	const service = await ServiceModel.findOne({ id, deletedAt: { $ne: null } }).lean();
	if (!service) AppError.notFound('SERVICE_NOT_FOUND', 'Service not found in trash');

	await ServiceModel.findOneAndUpdate(
		{ id, deletedAt: { $ne: null } },
		{ $unset: { deletedAt: '' } },
	);
	return cleanMongoFields({ ...service, deletedAt: undefined });
}
