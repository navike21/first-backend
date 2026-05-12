import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { ClientNotFoundError } from '../domain/errors/ClientErrors';
import ClientModel from '../infrastructure/ClientModel';

export async function getClientById(id: string) {
	const client = await ClientModel.findOne({
		id,
		status: { $ne: 'deleted' },
	}).lean();
	if (!client) throw new ClientNotFoundError();
	return cleanMongoFields(client);
}
