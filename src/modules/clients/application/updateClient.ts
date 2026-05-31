import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import {
	ClientNotFoundError,
	ClientBusinessNameConflictError,
} from '../domain/errors/ClientErrors';
import ClientModel from '../infrastructure/ClientModel';
import type { UpdateClientInput } from '../schemas/client.schema';

export async function updateClient(id: string, input: UpdateClientInput) {
	const client = await ClientModel.findOne({ id, deletedAt: null });
	if (!client) throw new ClientNotFoundError();

	if (input.businessName) {
		const conflict = await ClientModel.findOne({
			businessName: { $regex: new RegExp(`^${input.businessName}$`, 'i') },
			deletedAt: null,
			id: { $ne: id },
		});
		if (conflict) throw new ClientBusinessNameConflictError();
	}

	Object.assign(client, input);
	await client.save();
	return cleanMongoFields(
		client.toObject({ versionKey: false, getters: true }),
	);
}
