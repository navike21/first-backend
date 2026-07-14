import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import ClientModel from '../infrastructure/ClientModel';

export async function restoreClient(id: string) {
	const client = await ClientModel.findOne({
		id,
		deletedAt: { $ne: null },
	}).lean();
	if (!client)
		AppError.notFound('CLIENT_NOT_FOUND', 'Client not found in trash');

	await ClientModel.findOneAndUpdate(
		{ id, deletedAt: { $ne: null } },
		{ $unset: { deletedAt: '' } },
	);
	return cleanMongoFields({ ...client, deletedAt: undefined });
}
