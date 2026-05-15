import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { ClientNotFoundError } from '../domain/errors/ClientErrors';
import ClientModel from '../infrastructure/ClientModel';

export async function deleteClientLogical(id: string) {
	const client = await ClientModel.findOne({ id, status: { $ne: 'deleted' } });
	if (!client) throw new ClientNotFoundError();

	client.status = 'deleted';
	client.deletedAt = new Date();
	await client.save();

	return cleanMongoFields(
		client.toObject({ versionKey: false, getters: true }),
	);
}
