import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import ClientModel from '../infrastructure/ClientModel';

export async function deleteClientsBulk(ids: string[]) {
	const clients = await ClientModel.find({
		id: { $in: ids },
		deletedAt: null,
	}).lean();

	const processedIds = clients
		.map((c) => c.id)
		.filter((id): id is string => Boolean(id));
	const notFoundIds = ids.filter((id) => !processedIds.includes(id));

	if (processedIds.length === 0) {
		return { processed: [], processedIds: [], notFoundIds };
	}

	await ClientModel.updateMany(
		{ id: { $in: processedIds }, deletedAt: null },
		{ $set: { deletedAt: new Date() } },
	);

	return {
		processed: clients.map((c) => cleanMongoFields(c)),
		processedIds,
		notFoundIds,
	};
}
