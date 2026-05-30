import { ACTIVE, DELETED } from '@Constants/statusRegister';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import ClientModel from '../infrastructure/ClientModel';

export async function restoreClient(id: string) {
	const client = await ClientModel.findOne({ id, status: DELETED }).lean();
	if (!client) AppError.notFound('CLIENT_NOT_FOUND', 'Client not found in trash');

	await ClientModel.findOneAndUpdate(
		{ id, status: DELETED },
		{ $set: { status: ACTIVE }, $unset: { deletedAt: '' } },
	);
	return cleanMongoFields({ ...client, status: ACTIVE, deletedAt: undefined });
}
