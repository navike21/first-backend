import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import ServiceModel from '../infrastructure/ServiceModel';

export async function restoreService(id: string) {
	const service = await ServiceModel.findOne({ id, status: 'deleted' }).lean();
	if (!service) AppError.notFound('SERVICE_NOT_FOUND', 'Service not found in trash');

	await ServiceModel.findOneAndUpdate(
		{ id, status: 'deleted' },
		{ $set: { status: 'active' }, $unset: { deletedAt: '' } },
	);
	return cleanMongoFields({ ...service, status: 'active', deletedAt: undefined });
}
