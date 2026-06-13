import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import { deleteEntityFiles } from '@Modules/storage';
import ClientModel from '../infrastructure/ClientModel';
import { CLIENT_ENTITY_TYPE } from '../constants/paths';

export async function deleteClientPhysical(id: string) {
	const client = await ClientModel.findOne({ id, deletedAt: { $ne: null } }).lean();
	if (!client) AppError.notFound('CLIENT_NOT_FOUND', 'Client not found in trash');

	await ClientModel.deleteOne({ id });
	// Remove the client's stored files (logo) so no blobs are orphaned.
	await deleteEntityFiles(CLIENT_ENTITY_TYPE, id).catch(() => {});
	return cleanMongoFields(client);
}
