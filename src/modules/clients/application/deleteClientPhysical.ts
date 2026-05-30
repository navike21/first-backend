import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import ClientModel from '../infrastructure/ClientModel';

export async function deleteClientPhysical(id: string) {
	const deleted = await ClientModel.findOneAndDelete({ id }).lean();
	if (!deleted) AppError.notFound('CLIENT_NOT_FOUND', 'Client not found');
	return cleanMongoFields(deleted);
}
