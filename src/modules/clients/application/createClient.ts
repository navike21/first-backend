import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { ClientBusinessNameConflictError } from '../domain/errors/ClientErrors';
import ClientModel from '../infrastructure/ClientModel';
import type { CreateClientInput } from '../schemas/client.schema';

export async function createClient(input: CreateClientInput) {
	const existing = await ClientModel.findOne({
		businessName: { $regex: new RegExp(`^${input.businessName}$`, 'i') },
		status: { $ne: 'deleted' },
	});
	if (existing) throw new ClientBusinessNameConflictError();

	const client = await ClientModel.create(input);
	return cleanMongoFields(
		client.toObject({ versionKey: false, getters: true }),
	);
}
