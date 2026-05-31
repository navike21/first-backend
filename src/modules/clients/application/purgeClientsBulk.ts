import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import ClientModel from '../infrastructure/ClientModel';

export async function purgeClientsBulk(ids: string[]) {
	const clients = await ClientModel.find({ id: { $in: ids }, deletedAt: { $ne: null } }).lean();

	const processedIds = clients.map((c) => c.id).filter((id): id is string => Boolean(id));
	const notFoundIds = ids.filter((id) => !processedIds.includes(id));

	if (processedIds.length === 0) {
		return { processed: [], processedIds: [], notFoundIds };
	}

	await ClientModel.deleteMany({ id: { $in: processedIds } });

	return {
		processed: clients.map((c) => cleanMongoFields(c)),
		processedIds,
		notFoundIds,
	};
}
