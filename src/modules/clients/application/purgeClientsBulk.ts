import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { deleteEntityFiles } from '@Modules/storage';
import ClientModel from '../infrastructure/ClientModel';
import { CLIENT_ENTITY_TYPE } from '../constants/paths';

export async function purgeClientsBulk(ids: string[]) {
	const clients = await ClientModel.find({ id: { $in: ids }, deletedAt: { $ne: null } }).lean();

	const processedIds = clients.map((c) => c.id).filter((id): id is string => Boolean(id));
	const notFoundIds = ids.filter((id) => !processedIds.includes(id));

	if (processedIds.length === 0) {
		return { processed: [], processedIds: [], notFoundIds };
	}

	await ClientModel.deleteMany({ id: { $in: processedIds } });
	// Remove each purged client's stored files so no blobs are orphaned.
	await Promise.all(
		processedIds.map((id) =>
			deleteEntityFiles(CLIENT_ENTITY_TYPE, id).catch(() => {}),
		),
	);

	return {
		processed: clients.map((c) => cleanMongoFields(c)),
		processedIds,
		notFoundIds,
	};
}
